"""RAG tool: searches the user's uploaded documents via Qdrant.

Embeds queries through the HuggingFace Inference API (remote) instead of
loading sentence-transformers/PyTorch locally — keeps memory usage low
enough to run on Render's free tier (512MB). Uses the same model
(all-MiniLM-L6-v2, 384-dim) as the ingestion pipeline, so it stays
compatible with an existing Qdrant collection populated that way.
"""

from huggingface_hub import InferenceClient
from qdrant_client import QdrantClient

from config import settings

_client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
_hf = InferenceClient(token=settings.HF_TOKEN)

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
COLLECTION_NAME = settings.QDRANT_COLLECTION or "documents"


def _embed(text: str) -> list[float]:
    vector = _hf.feature_extraction(text, model=EMBEDDING_MODEL)
    # feature_extraction can return a nested list (token-level) or a flat
    # vector depending on the model; normalize to a single flat list.
    if isinstance(vector[0], (list, tuple)):
        # mean-pool token embeddings if the API returns per-token vectors
        num_tokens = len(vector)
        dim = len(vector[0])
        pooled = [sum(vector[t][d] for t in range(num_tokens)) / num_tokens for d in range(dim)]
        return pooled
    return list(vector)


def run_rag_search(query: str, top_k: int = 4) -> str:
    """Embed the query remotely, retrieve the closest document chunks."""
    try:
        query_vector = _embed(query)
        hits = _client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k,
        )
    except Exception as exc:
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