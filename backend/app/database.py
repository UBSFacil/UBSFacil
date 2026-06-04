from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Base pode ser criado sem DATABASE_URL (necessário para Alembic autogenerate)
Base = declarative_base()

# Mas engine e SessionLocal só são criados se DATABASE_URL estiver definido
if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
else:
    engine = None
    SessionLocal = None

def get_db():
    if not SessionLocal:
        raise RuntimeError("DATABASE_URL not configured. Check your .env file.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()