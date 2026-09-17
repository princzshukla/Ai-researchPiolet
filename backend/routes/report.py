"""GET /report/{id} — fetch a previously generated report."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import get_db
from db import crud

router = APIRouter()


@router.get("/report/{report_id}")
def get_report(report_id: str, db: Session = Depends(get_db)):
    record = crud.get_report(db, report_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "id": record.id,
        "task": record.task,
        "plan": record.plan,
        "completed_steps": record.completed_steps,
        "final_report": record.final_report,
        "status": record.status,
        "created_at": record.created_at,
    }