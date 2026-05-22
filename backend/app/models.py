from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base

class Unidade(Base):
    __tablename__ = "unidades"
    id       = Column(Integer, primary_key=True)
    nome     = Column(String(100), nullable=False)
    endereco = Column(String(200), nullable=False)
    estoque  = relationship("Estoque", back_populates="unidade")

class Medicamento(Base):
    __tablename__ = "medicamentos"
    id      = Column(Integer, primary_key=True)
    nome    = Column(String(100), nullable=False)
    estoque = relationship("Estoque", back_populates="medicamento")

class Estoque(Base):
    __tablename__ = "estoque"
    id             = Column(Integer, primary_key=True)
    medicamento_id = Column(Integer, ForeignKey("medicamentos.id"), nullable=False)
    unidade_id     = Column(Integer, ForeignKey("unidades.id"), nullable=False)
    quantidade     = Column(Integer, default=0)
    atualizado_em  = Column(DateTime, server_default=func.now())
    medicamento    = relationship("Medicamento", back_populates="estoque")
    unidade        = relationship("Unidade", back_populates="estoque")