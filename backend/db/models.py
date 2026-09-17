"""SQLAlchemy models: one row per agent run, storing the task and its report."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase


class Base(DeclarativeBase):
    pass


class ReportRecord(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    task: Mapped[str] = mapped_column(Text, nullable=False)
    plan: Mapped[list] = mapped_column(JSON, nullable=True)
    completed_steps: Mapped[list] = mapped_column(JSON, nullable=True)
    final_report: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending | done | failed
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )