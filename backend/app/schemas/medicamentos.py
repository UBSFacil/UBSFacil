from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ===== MEDICAMENTO =====
class MedicamentoCreate(BaseModel):
    """Schema para criação de medicamento."""
    nome: str
    categoria: Optional[str] = None
    forma: Optional[str] = None


class MedicamentoUpdate(BaseModel):
    """Schema para atualização de medicamento."""
    nome: Optional[str] = None
    categoria: Optional[str] = None
    forma: Optional[str] = None


class MedicamentoResponse(BaseModel):
    """Schema de resposta de medicamento."""
    id: int
    nome: str
    categoria: Optional[str] = None
    forma: Optional[str] = None

    class Config:
        from_attributes = True


# ===== UNIDADE =====
class UnidadeCreate(BaseModel):
    """Schema para criação de unidade."""
    nome: str
    endereco: str
    bairro: Optional[str] = None


class UnidadeUpdate(BaseModel):
    """Schema para atualização de unidade."""
    nome: Optional[str] = None
    endereco: Optional[str] = None
    bairro: Optional[str] = None


class UnidadeResponse(BaseModel):
    """Schema de resposta de unidade."""
    id: int
    nome: str
    endereco: str
    bairro: Optional[str] = None

    class Config:
        from_attributes = True


# ===== ESTOQUE =====
class EstoqueCreate(BaseModel):
    """Schema para criação de estoque."""
    medicamento_id: int
    unidade_id: int
    quantidade: int


class EstoqueUpdate(BaseModel):
    """Schema para atualização de estoque."""
    quantidade: int


class EstoqueResponse(BaseModel):
    """Schema de resposta de estoque."""
    id: int
    medicamento_id: int
    unidade_id: int
    quantidade: int
    atualizado_em: datetime

    class Config:
        from_attributes = True


class EstoqueDetalhado(BaseModel):
    """Schema de estoque com dados expandidos."""
    id: int
    medicamento: MedicamentoResponse
    unidade: UnidadeResponse
    quantidade: int
    atualizado_em: datetime

    class Config:
        from_attributes = True


# ===== RETIRADA =====
class RetiradaCreate(BaseModel):
    """Schema para criação de retirada."""
    medicamento_id: int
    unidade_id: int


class RetiradaResponse(BaseModel):
    """Schema de resposta de retirada."""
    id: int
    usuario_id: int
    medicamento_id: int
    unidade_id: int
    retirado_em: datetime

    class Config:
        from_attributes = True
