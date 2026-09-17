"""Shared state that flows through every node in the LangGraph graph."""

from typing import TypedDict, Optional


class CompletedStep(TypedDict):
    step: str
    tool_used: str
    result: str


class AgentState(TypedDict):
    task: str                          # original user task/question
    plan: list[str]                    # steps the planner decided on
    current_step_index: int            # which step we're currently on
    completed_steps: list[CompletedStep]
    final_report: Optional[str]