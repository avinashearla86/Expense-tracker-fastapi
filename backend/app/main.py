from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, expenses
from app import models
from app.database import engine

# ✅ Create database tables
models.Base.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(
    title="Expense Tracker API",
    description="Backend for personal expense tracking application",
    version="1.0.0"
)

# ✅ Allow frontend URLs
origins = [
    "http://localhost:5173",  # Local development
    "https://expense-tracker-fastapi-topaz.vercel.app",  # Vercel deployed frontend
]

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
