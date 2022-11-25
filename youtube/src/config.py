from typing import List

from decouple import config


class MissingYouTubeAPIKeysError(Exception):
    pass


class Config:
    def parse_youtube_api_keys(self) -> None:
        keys = config("YOUTUBE_API_KEYS", default="")

        if not keys:
            raise MissingYouTubeAPIKeysError(
                "Please make sure your YouTube API keys are present in the .env"
            )

        self.YOUTUBE_API_KEYS = [key.strip() for key in keys.split(",")]

    def get_youtube_api_keys(self) -> List[str]:
        if not hasattr(self, "YOUTUBE_API_KEYS"):
            self.parse_youtube_api_keys()

        return self.YOUTUBE_API_KEYS
