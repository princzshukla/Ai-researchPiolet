"""Report generator node: compiles all gathered results into a final report."""

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from agent.state import AgentState
from config import settings

_llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="openai/gpt-oss-120b",
    temperature=0.3,
)

_SYSTEM_PROMPT = """You are a report-writing agent. Using the research findings
provided, write a clear, well-structured report in markdown that answers the
original task. Use headers, bullet points where useful, and cite which
findings support each section. Do not invent information not present in the
findings."""


def _format_findings(state: AgentState) -> str:
    lines = []
    for i, item in enumerate(state["completed_steps"], start=1):
        lines.append(
            f"{i}. Step: {item['step']}\n"
            f"   Tool used: {item['tool_used']}\n"
            f"   Result: {item['result']}"
        )
    return "\n\n".join(lines)


def report_node(state: AgentState) -> dict:
    findings = _format_findings(state)

    response = _llm.invoke([
        SystemMessage(content=_SYSTEM_PROMPT),
        HumanMessage(content=(
            f"Original task: {state['task']}\n\n"
            f"Research findings:\n{findings}"
        )),
    ])

    return {"final_report": response.content}