"""FastAPI app entrypoint: creates the app, sets up CORS, registers routes."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.session import init_db
from routes import task, report


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- startup ---
    init_db()
    yield
    # --- shutdown ---
    # add cleanup here later (e.g. closing clients or connection pools)


app = FastAPI(title="Research Agent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your Vercel frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task.router)
app.include_router(report.router)


@app.get("/")
def health_check():
    return {"status": "ok"}