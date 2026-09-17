"""POST /task — runs the full planner -> executor -> report_generator graph."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.session import get_db
from db import crud
from agent.graph import app_graph

router = APIRouter()


class TaskRequest(BaseModel):
    task: str


class TaskResponse(BaseModel):
    id: str
    status: str
    final_report: str | None = None


@router.post("/task", response_model=TaskResponse)
def submit_task(payload: TaskRequest, db: Session = Depends(get_db)):
    if not payload.task or not payload.task.strip():
        raise HTTPException(status_code=400, detail="task must not be empty")

    record = crud.create_pending_report(db, task=payload.task)

    initial_state = {
        "task": payload.task,
        "plan": [],
        "current_step_index": 0,
        "completed_steps": [],
        "final_report": None,
    }

    try:
        # Runs synchronously — fine for a portfolio demo. For production,
        # move this to a background task/queue so the request doesn't block.
        result_state = app_graph.invoke(initial_state)
    except Exception as exc:
        crud.mark_report_failed(db, record.id, str(exc))
        raise HTTPException(status_code=500, detail=f"Agent run failed: {exc}")

    updated = crud.save_report_result(
        db,
        report_id=record.id,
        plan=result_state.get("plan", []),
        completed_steps=result_state.get("completed_steps", []),
        final_report=result_state.get("final_report", ""),
    )

    return TaskResponse(
        id=updated.id,
        status=updated.status,
        final_report=updated.final_report,
    )