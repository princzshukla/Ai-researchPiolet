"""Database engine and session setup."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings
from db.models import Base

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Create tables if they don't exist yet. Call once on startup."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency: yields a DB session, closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()