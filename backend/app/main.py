from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, expenses
from app import models
from app.database import engine

# ✅ Create database tables (if they don’t already exist)
models.Base.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(
    title="Expense Tracker API",
    description="Backend for personal expense tracking application",
    version="1.0.0"
)

# ✅ Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(users.router)
app.include_router(expenses.router)

# ✅ Root endpoint
@app.get("/")
def read_root():
    return {"message": "Expense Tracker API is running 🚀"}
