import logging
import sys

import schedule

from config import Config, MissingYouTubeAPIKeysError
from youtube import YouTube

JOB_FREQUENCY_IN_SECONDS = 10

logging.basicConfig(
    format="%(asctime)s %(filename)s [%(levelname)s] %(message)s",
    level=logging.INFO,
    datefmt="%m/%d/%Y %I:%M:%S %p",
)
logger = logging.getLogger(__name__)


class Job:
    def __init__(self, config: Config) -> None:
        self.config = config

    def setup(self) -> None:
        try:
            YOUTUBE_API_KEYS = self.config.get_youtube_api_keys()

            logger.info(
                f"Loaded YOUTUBE_API_KEYS successfully <{', '.join(YOUTUBE_API_KEYS)}>"
            )

            self.job = YouTube(YOUTUBE_API_KEYS)
        except MissingYouTubeAPIKeysError as e:
            logger.error(e)
            logger.info("Shutting down the scheduler")
            sys.exit()

    def run(self) -> None:
        self.job.main()


def main():
    job = Job(config=Config())
    job.setup()

    logger.info(f"Scheduling a job to run every {JOB_FREQUENCY_IN_SECONDS} seconds")
    logger.info(f"Please wait for 10 seconds...")

    schedule.every(JOB_FREQUENCY_IN_SECONDS).seconds.do(job.run)

    while True:
        schedule.run_pending()


if __name__ == "__main__":
    main()
