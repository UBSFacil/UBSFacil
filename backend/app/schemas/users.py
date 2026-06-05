from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ===== USUARIO =====
class UsuarioCreate(BaseModel):
    """Schema para criação de usuário (sign-up)."""
    nome: str
    email: EmailStr
    sus_cartao: str
    senha: str


class UsuarioLogin(BaseModel):
    """Schema para login (alternativa ao form)."""
    email: EmailStr
    senha: str


class UsuarioResponse(BaseModel):
    """Schema de resposta de usuário (sem senha)."""
    id: int
    nome: str
    email: EmailStr
    sus_cartao: str
    is_admin: bool

    class Config:
        from_attributes = True


# ===== ADMIN =====
class AdminCreate(BaseModel):
    """Schema para criação de admin."""
    nome: str
    email: EmailStr
    senha: str


class AdminResponse(BaseModel):
    """Schema de resposta de admin."""
    id: int
    nome: str
    email: EmailStr

    class Config:
        from_attributes = True


# ===== TOKEN =====
class Token(BaseModel):
    """Schema de resposta de login."""
    access_token: str
    token_type: str
