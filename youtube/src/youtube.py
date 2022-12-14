import datetime
import logging
from typing import Dict, List, Union

import requests
from mongoengine.errors import NotUniqueError

from mongo import Videos

logger = logging.getLogger(__name__)

API = "https://youtube.googleapis.com/youtube/v3/search"


class APIKey:
    def __init__(self, key: str) -> None:
        self.key = key
        self.has_expired = False


class YouTube:
    def __init__(self, api_keys: List[str], query: str) -> None:
        self.API_KEYS = [APIKey(key) for key in api_keys]
        self.query = query

    def main(self) -> None:
        logger.info("Initializing YouTube script")
        self.__fetch_videos()

    def __parse_thumbnails(self, thumbnails: Dict[str, any]) -> Dict[str, str]:
        return dict(
            [(quality, metadata["url"]) for quality, metadata in thumbnails.items()]
        )

    def __parse_snippet(
        self, item: Dict[str, any]
    ) -> Dict[str, Union[str, Dict[str, str]]]:
        snippet = item["snippet"]

        return {
            "videoId": item["id"]["videoId"],
            "title": snippet["title"],
            "description": snippet["description"],
            "publishedAt": snippet["publishedAt"],
            "thumbnails": self.__parse_thumbnails(snippet["thumbnails"]),
        }

    def __save_videos(self, response) -> None:
        total_videos = response["pageInfo"]["resultsPerPage"]

        logger.info(f"Found {total_videos} videos")
        save_count = 0

        for item_number, item in enumerate(response["items"], start=1):
            logger.info(f"Processing {item_number}/{total_videos}")

            try:
                Videos(**self.__parse_snippet(item)).save()
                save_count += 1
            except NotUniqueError as e:
                logger.info(
                    "Found a video that already exists in our database. Ignoring it"
                )
            except Exception as e:
                logger.error(
                    "An unexpected error has occurred while saving the document to the database"
                )
                logger.error(e)

        logger.info(f"Saved {save_count} new videos to the database")

    def __has_api_key_expired(self, response, json_response, api_key) -> bool:
        if (
            response.status_code == 403
            and "exceeded" in json_response["error"]["message"]
        ):
            logger.warn(f"The following API key has reached its limit <{api_key.key}>")
            logger.info(f"Marking <{api_key.key}> as expired")
            api_key.has_expired = True
            return True

        return False

    def __fetch_videos(self) -> None:
        logger.info("Attempting to fetch videos from YouTube")

        has_any_api_key_worked = False

        for api_key in self.API_KEYS:
            if api_key.has_expired:
                continue

            # Use a time from two days before.
            PUBLISHED_AFTER = (
                datetime.datetime.now(datetime.timezone.utc)
                - datetime.timedelta(days=2)
            ).isoformat()

            params = {
                "order": "date",
                "type": "video",
                "part": "id, snippet",
                "maxResults": 10,
                "publishedAfter": PUBLISHED_AFTER,
                "key": api_key.key,
                "q": self.query,
            }

            try:
                logger.info(
                    f"Attempting to make a request to YouTube for <query: {self.query}> with <APIKey key={api_key.key}>"
                )

                response = requests.get(API, params=params)
                payload = response.json()

                if self.__has_api_key_expired(response, payload, api_key):
                    continue

                if response.status_code < 200 or response.status_code >= 300:
                    logger.error(
                        f"Could not fetch videos from YouTube due to the following reason: {payload['error']['message']}"
                    )
                    continue

                has_any_api_key_worked = True
                self.__save_videos(payload)

                break
            except Exception as e:
                logger.error("An unexpected error has occurred")
                logger.error(e)

        if not has_any_api_key_worked:
            logger.error("All API keys have reached their limit")
