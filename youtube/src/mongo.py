from mongoengine import DateTimeField, DictField, Document, StringField, connect

from config import Config

DATABASE_NAME = "famtube"


class Database:
    def __init__(self) -> None:
        self.config = Config()

    def initialize(self) -> None:
        self.client = connect(
            db=DATABASE_NAME,
            host=self.config.MONGODB_HOST,
            port=self.config.MONGODB_PORT,
        )


class Videos(Document):
    videoId = StringField(required=True, unique=True)
    title = StringField(required=True)
    description = StringField()
    publishedAt = DateTimeField(required=True)
    thumbnails = DictField()

    # Index video_id and use text index for (title, description) for search queries.
    meta = {
        "indexes": [
            "videoId",
            "publishedAt",
            {
                "fields": ["$title", "$description"],
            },
        ],
        "ordering": ["-publishedAt"],
    }


Database().initialize()
