from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from jose import jwt
from passlib.context import CryptContext
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "chave-secreta-ubsfacil")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
@router.post("/auth/login")
def login(dados: dict, db: Session = Depends(get_db)):
    return {"mensagem": "rota fucionando"}