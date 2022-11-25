import logging
from typing import List

logger = logging.getLogger(__name__)


class YouTube:
    def __init__(self, API_KEYS: List[str]) -> None:
        self.API_KEYS = API_KEYS

    def main(self) -> None:
        logger.info("Initializing YouTube script")
