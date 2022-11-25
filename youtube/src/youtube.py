import datetime
import logging
from typing import Dict, List, Union

import requests
from mongo import Videos
from mongoengine.errors import NotUniqueError

logger = logging.getLogger(__name__)

API = "https://youtube.googleapis.com/youtube/v3/search"


class YouTube:
    def __init__(self, API_KEYS: List[str]) -> None:
        self.API_KEYS = API_KEYS

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

    def __fetch_videos(self) -> None:
        CURRENT_UTC_DATE_TIME = datetime.datetime.now(datetime.timezone.utc).isoformat()
        QUERY = "official"  # TODO: Accept q from environment variable.

        params = {
            "order": "date",
            "type": "video",
            "part": "id, snippet",
            "maxResults": 10,
            "publishedAfter": CURRENT_UTC_DATE_TIME,
            "key": self.API_KEYS[0],  # FIXME: Cycle through API keys.
            "q": QUERY,
        }

        # FIXME: Catch exceptions precisely and set a fallback for cycling API keys.
        try:
            logger.info(f"Attempting to fetch videos for <query: {QUERY}>")

            r = requests.get(API, params=params)
            response = r.json()

            logger.info(f"Found {response['pageInfo']['resultsPerPage']} videos")

            for item in response["items"]:
                try:
                    Videos(**self.__parse_snippet(item)).save()
                except NotUniqueError as e:
                    logger.info(
                        "Found a video that already exists in our database. Ignoring it"
                    )

        except Exception as e:
            logger.error("We are unable to connect to the API. Is your internet down?")
            logger.error(e)
