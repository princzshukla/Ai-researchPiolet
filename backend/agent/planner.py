"""Planner node: turns the raw task into a numbered list of concrete steps."""

import re

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from agent.state import AgentState
from config import settings

_llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="openai/gpt-oss-120b",
    temperature=0.2,
)

_SYSTEM_PROMPT = """You are a planning agent. Given a research or business task,
break it into 2 to 5 concrete, actionable steps that a research agent could
execute using tools such as web search, document retrieval (RAG), or a
calculator. Return ONLY a numbered list, one step per line. No preamble."""


def _parse_plan(raw_text: str) -> list[str]:
    """Extract clean step strings from a numbered-list LLM response."""
    lines = raw_text.strip().splitlines()
    steps = []
    for line in lines:
        cleaned = re.sub(r"^\s*\d+[\.\)]\s*", "", line).strip()
        if cleaned:
            steps.append(cleaned)
    return steps


def planner_node(state: AgentState) -> dict:
    response = _llm.invoke([
        SystemMessage(content=_SYSTEM_PROMPT),
        HumanMessage(content=f"Task: {state['task']}"),
    ])

    plan = _parse_plan(response.content)
    if not plan:
        # fallback so the graph never gets stuck with an empty plan
        plan = [state["task"]]

    return {
        "plan": plan,
        "current_step_index": 0,
        "completed_steps": [],
    }