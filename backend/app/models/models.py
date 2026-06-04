from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class Unidade(Base):
    __tablename__ = "unidades"
    id       = Column(Integer, primary_key=True, index=True)
    nome     = Column(String(100), nullable=False)
    endereco = Column(String(200), nullable=False)
    bairro   = Column(String(100))
    estoque  = relationship("Estoque", back_populates="unidade")

class Medicamento(Base):
    __tablename__ = "medicamentos"
    id        = Column(Integer, primary_key=True, index=True)
    nome      = Column(String(100), nullable=False)
    categoria = Column(String(100))
    forma     = Column(String(100))
    estoque   = relationship("Estoque", back_populates="medicamento")

class Estoque(Base):
    __tablename__ = "estoque"
    id             = Column(Integer, primary_key=True, index=True)
    medicamento_id = Column(Integer, ForeignKey("medicamentos.id"), nullable=False)
    unidade_id     = Column(Integer, ForeignKey("unidades.id"), nullable=False)
    quantidade     = Column(Integer, default=0)
    atualizado_em  = Column(DateTime, server_default=func.now())
    medicamento    = relationship("Medicamento", back_populates="estoque")
    unidade        = relationship("Unidade", back_populates="estoque")

class Usuario(Base):
    __tablename__ = "usuarios"
    id          = Column(Integer, primary_key=True, index=True)
    nome        = Column(String(100), nullable=False)
    email       = Column(String(150), unique=True, nullable=False)
    sus_cartao  = Column(String(20), unique=True, nullable=False)
    senha_hash  = Column(String(255), nullable=False)
    is_admin    = Column(Boolean, default=False)
    retiradas   = relationship("Retirada", back_populates="usuario")

class Admin(Base):
    __tablename__ = "admins"
    id         = Column(Integer, primary_key=True, index=True)
    nome       = Column(String(100), nullable=False)
    email      = Column(String(150), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)

class Retirada(Base):
    __tablename__ = "retiradas"
    id             = Column(Integer, primary_key=True, index=True)
    usuario_id     = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    medicamento_id = Column(Integer, ForeignKey("medicamentos.id"), nullable=False)
    unidade_id     = Column(Integer, ForeignKey("unidades.id"), nullable=False)
    retirado_em    = Column(DateTime, server_default=func.now())
    usuario        = relationship("Usuario", back_populates="retiradas")
    medicamento    = relationship("Medicamento")
    unidade        = relationship("Unidade")
