"""Wires the planner, executor, and report generator into a LangGraph graph."""

from langgraph.graph import StateGraph, END

from agent.state import AgentState
from agent.planner import planner_node
from agent.executor import executor_node
from agent.report_generator import report_node


def should_continue(state: AgentState) -> str:
    """After the executor runs, decide whether more steps remain."""
    if state["current_step_index"] < len(state["plan"]):
        return "executor"
    return "report_generator"


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("planner", planner_node)
    graph.add_node("executor", executor_node)
    graph.add_node("report_generator", report_node)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "executor")
    graph.add_conditional_edges(
        "executor",
        should_continue,
        {
            "executor": "executor",
            "report_generator": "report_generator",
        },
    )
    graph.add_edge("report_generator", END)

    return graph.compile()


# Compiled graph, ready to call with app_graph.invoke(initial_state)
app_graph = build_graph()