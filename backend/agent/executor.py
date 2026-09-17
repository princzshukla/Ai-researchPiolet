"""Executor node: for the current step, decides which tool to call and runs it."""

import json

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from agent.state import AgentState
from config import settings

# Tool implementations live in tools/ — imported lazily-friendly names.
from tools.web_search_tool import run_web_search
from tools.rag_tool import run_rag_search
from tools.calculator_tool import run_calculator

_llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="openai/gpt-oss-120b",
    temperature=0,
)

_SYSTEM_PROMPT = """You choose exactly one tool to accomplish a given step.
Available tools:
- web_search: search the live web for current information
- rag_search: search the user's uploaded documents (vector store)
- calculator: evaluate a math expression

Respond ONLY with JSON in this exact shape, no other text:
{"tool": "web_search" | "rag_search" | "calculator", "query": "<the search query or expression>"}
"""

_TOOLS = {
    "web_search": run_web_search,
    "rag_search": run_rag_search,
    "calculator": run_calculator,
}


def _choose_tool(step: str) -> dict:
    response = _llm.invoke([
        SystemMessage(content=_SYSTEM_PROMPT),
        HumanMessage(content=f"Step: {step}"),
    ])
    try:
        parsed = json.loads(response.content)
        if parsed.get("tool") in _TOOLS and "query" in parsed:
            return parsed
    except (json.JSONDecodeError, AttributeError):
        pass
    # safe fallback if the model returns malformed JSON
    return {"tool": "web_search", "query": step}


def executor_node(state: AgentState) -> dict:
    step = state["plan"][state["current_step_index"]]

    choice = _choose_tool(step)
    tool_fn = _TOOLS[choice["tool"]]
    result = tool_fn(choice["query"])

    completed = state["completed_steps"] + [{
        "step": step,
        "tool_used": choice["tool"],
        "result": result,
    }]

    return {
        "completed_steps": completed,
        "current_step_index": state["current_step_index"] + 1,
    }