"""Loads configuration from environment variables (.env file)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    TAVILY_API_KEY: str
    QDRANT_URL: str
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION: str = "documents"
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()