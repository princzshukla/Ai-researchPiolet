"""Web search tool: searches the live web via Tavily's API (free tier)."""

from tavily import TavilyClient

from config import settings

_client = TavilyClient(api_key=settings.TAVILY_API_KEY)


def run_web_search(query: str, max_results: int = 5) -> str:
    """Run a web search and return a compact text summary of top results.

    Returns a string (not raw JSON) so it can be dropped straight into an
    LLM prompt for the report generator.
    """
    try:
        response = _client.search(query=query, max_results=max_results)
    except Exception as exc:  # network/API errors shouldn't crash the graph
        return f"Web search failed for query '{query}': {exc}"

    results = response.get("results", [])
    if not results:
        return f"No web results found for '{query}'."

    formatted = []
    for r in results:
        title = r.get("title", "Untitled")
        url = r.get("url", "")
        content = r.get("content", "").strip()
        formatted.append(f"- {title} ({url}): {content}")

    return "\n".join(formatted)