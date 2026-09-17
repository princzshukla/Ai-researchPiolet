"""CRUD helpers for report records."""

from sqlalchemy.orm import Session

from db.models import ReportRecord


def create_pending_report(db: Session, task: str) -> ReportRecord:
    record = ReportRecord(task=task, status="pending")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def save_report_result(
    db: Session,
    report_id: str,
    plan: list,
    completed_steps: list,
    final_report: str,
) -> ReportRecord:
    record = db.get(ReportRecord, report_id)
    if record is None:
        raise ValueError(f"No report found with id {report_id}")

    record.plan = plan
    record.completed_steps = completed_steps
    record.final_report = final_report
    record.status = "done"
    db.commit()
    db.refresh(record)
    return record


def mark_report_failed(db: Session, report_id: str, error: str) -> None:
    record = db.get(ReportRecord, report_id)
    if record is not None:
        record.status = "failed"
        record.final_report = f"Agent run failed: {error}"
        db.commit()


def get_report(db: Session, report_id: str) -> ReportRecord | None:
    return db.get(ReportRecord, report_id)