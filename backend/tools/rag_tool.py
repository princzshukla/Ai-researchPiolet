"""RAG tool: searches the user's uploaded documents via Qdrant.

Reuses the same embedding model and collection approach as the rag-doc-chat
project, so an existing Qdrant collection populated by that pipeline can be
queried directly from here.
"""

from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

from config import settings

_client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
_embedder = SentenceTransformer("all-MiniLM-L6-v2")

COLLECTION_NAME = settings.QDRANT_COLLECTION or "documents"


def run_rag_search(query: str, top_k: int = 4) -> str:
    """Embed the query, retrieve the closest document chunks, return them as text."""
    try:
        query_vector = _embedder.encode(query).tolist()
        hits = _client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k,
        )
    except Exception as exc:  # missing collection, connection issues, etc.
        return f"RAG search failed for query '{query}': {exc}"

    if not hits:
        return f"No relevant document chunks found for '{query}'."

    chunks = []
    for hit in hits:
        text = hit.payload.get("text", "") if hit.payload else ""
        source = hit.payload.get("source", "unknown") if hit.payload else "unknown"
        if text:
            chunks.append(f"[{source}] {text}")

    return "\n\n".join(chunks) if chunks else f"No usable content found for '{query}'."