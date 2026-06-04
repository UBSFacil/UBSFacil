from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, get_db, Base
from .models import Medicamento, Unidade, Estoque
from .routers import auth

# Cria as tabelas automaticamente se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

def seed_db(db: Session):
    """Popula o banco com dados iniciais se estiver vazio."""
    if db.query(Medicamento).count() > 0:
        return

    meds = [
        Medicamento(nome="Paracetamol"),
        Medicamento(nome="Amoxicilina"),
        Medicamento(nome="Ibuprofeno"),
        Medicamento(nome="Dipirona"),
        Medicamento(nome="Omeprazol"),
    ]
    ubs_list = [
        Unidade(nome="UBS Vila Nova",  endereco="Rua das Flores, 100"),
        Unidade(nome="UBS Centro",     endereco="Av. Principal, 200"),
        Unidade(nome="UBS Jardim Sul", endereco="Rua do Parque, 300"),
    ]
    db.add_all(meds + ubs_list)
    db.commit()

    estoques = [
        Estoque(unidade_id=1, medicamento_id=1, quantidade=50),
        Estoque(unidade_id=1, medicamento_id=4, quantidade=30),
        Estoque(unidade_id=2, medicamento_id=2, quantidade=20),
        Estoque(unidade_id=2, medicamento_id=5, quantidade=15),
        Estoque(unidade_id=3, medicamento_id=3, quantidade=40),
    ]
    db.add_all(estoques)
    db.commit()


@app.on_event("startup")
def startup():
    db = next(get_db())
    seed_db(db)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/medicamentos")
def listar_medicamentos(busca: str = Query(default=""), db: Session = Depends(get_db)):
    query = db.query(Medicamento)
    if busca:
        query = query.filter(Medicamento.nome.ilike(f"%{busca}%"))
    return [{"id": m.id, "nome": m.nome} for m in query.all()]


@app.get("/ubs")
def listar_ubs(db: Session = Depends(get_db)):
    return [{"id": u.id, "nome": u.nome, "endereco": u.endereco} for u in db.query(Unidade).all()]


@app.get("/ubs/{ubs_id}/disponibilidade")
def disponibilidade_ubs(ubs_id: int, db: Session = Depends(get_db)):
    estoques = db.query(Estoque).filter(Estoque.unidade_id == ubs_id).all()
    return [
        {"medicamento": e.medicamento.nome, "quantidade": e.quantidade}
        for e in estoques
    ]