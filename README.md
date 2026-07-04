# 🏥 UBSFacil

Uma plataforma web para pacientes consultarem a disponibilidade de medicamentos nas Unidades Básicas de Saúde (UBS) da sua região.

---

## 📌 Índice

- [📜 Descrição](#-descrição)
- [🚀 Recursos](#-recursos)
- [🛠 Tecnologias](#-tecnologias)
- [✅ Pré-requisitos](#-pré-requisitos)
- [🔧 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [▶️ Uso](#️-uso)
- [🔌 API — Endpoints](#-api--endpoints)
- [🗂️ Arquitetura](#️-arquitetura)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔒 Segurança](#-segurança)
- [📊 Status do Projeto](#-status-do-projeto)
- [🧪 Testes](#-testes)
- [🤝 Contribuição](#-contribuição)
- [👥 Equipe](#-equipe)
- [📄 Licença](#-licença)

---

## 📜 Descrição

**UBSFacil** é uma plataforma web que facilita o acesso dos pacientes às informações sobre medicamentos disponíveis nas Unidades Básicas de Saúde. O sistema permite consultar a disponibilidade de medicamentos por UBS, visualizar o histórico de retiradas e se inscrever em alertas de estoque.

O projeto foi desenvolvido por uma equipe de 7 pessoas ao longo de 12 semanas, divididas em 3 fases: **MVP** (Semanas 1–4), **Evolução** (Semanas 5–8) e **Deploy** (Semanas 9–12).

### 🎯 Objetivo

Demonstrar conhecimentos em desenvolvimento web full-stack com React e FastAPI, autenticação JWT, ORM com SQLAlchemy.

---

## 🚀 Recursos

### Implementados ✅

- 👤 **Autenticação** — Login com CPF e senha
- 💊 **Busca de Medicamentos** — Busca por nome com filtros por UBS, disponibilidade e paginação
- 🏥 **UBSs** — Listagem de unidades com nome, endereço, horário e tela de detalhes com medicamentos disponíveis
- 📋 **Histórico de Retiradas** — Listagem por paciente com filtros por data e UBS
- 🎨 **Interface Responsiva** — Layout mobile-first com CSS Modules e media queries
- ♿ **Acessibilidade** — `aria-label` e navegação por teclado nos formulários

### Próximas Features 📅

- 🔎 Busca por geolocalização (UBSs mais próximas)
- 📊 Painel do gestor de UBS

---

## 🛠 Tecnologias

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | React 18, Vite, CSS Modules, Framer Motion, React Router, Axios |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic, SQLAlchemy |
| **Banco de Dados** | PostgreSQL 16, Alembic (migrations) |
| **Testes** | pytest, httpx |
| **Gestão** | ClickUp, Conventional Commits, Microsoft Teams |

---

## ✅ Pré-requisitos

- **Node.js 18+**
- **Python 3.10+**
- **Git**

---

## 🔧 Instalação

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/UBSFacil/UBSFacil.git
cd UBSFacil
```

### 2️⃣ Configure o Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### 3️⃣ Configure o Backend

```bash
cd ../backend/app

# Crie e ative o ambiente virtual
python -m venv venv

# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

**Dependências principais:**

```
fastapi==0.111.0
uvicorn==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
pydantic==2.7.1
python-jose==3.3.0
passlib==1.7.4
psycopg2-binary==2.9.9
pytest==8.2.0
```

### 5️⃣ Aplique as migrations e seeds

```bash
cd backend/app

# Aplicar migrations
alembic upgrade head

# Popular o banco com dados de teste
psql -U ubsfacil_user -d ubsfacil_db -f ../../Database/seeds/seeds.sql
```

---

## ⚙️ Configuração

### Backend — `backend/app/env`

```env
POSTGRES_DB=ubsfacil_db
POSTGRES_USER=ubsfacil_user
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

SECRET_KEY=sua-chave-secreta-longa-e-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

> ⚠️ Nunca exponha credenciais no código. Os arquivos `env` e `.env` já estão no `.gitignore`.

---

## ▶️ Uso

### Iniciar o Backend

```bash
cd backend/app
source venv/bin/activate  # Linux/Mac

uvicorn main:app --reload --port 8000
```

Documentação interativa disponível em `http://localhost:8000/docs`.

### Iniciar o Frontend

```bash
cd frontend
npm run dev
```

Acesse em `http://localhost:5173`.

### Build de produção

```bash
cd frontend
npm run build
```

---

## 🔌 API — Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Login com CPF e senha |
| `GET` | `/auth/me` | Dados do paciente autenticado |

### UBSs
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/ubs` | Lista todas as UBSs |
| `GET` | `/ubs/{id}` | Detalhes de uma UBS |
| `GET` | `/ubs/{id}/disponibilidade` | Medicamentos disponíveis na UBS com estoque |

### Medicamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/medicamentos` | Lista medicamentos |
| `GET` | `/medicamentos/{id}/disponibilidade` | Disponibilidade por UBS |

### Paciente
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/paciente/historico` | Histórico de retiradas do paciente autenticado |


---

## 🗂️ Arquitetura

```
Usuário (Browser)
       │
       ▼
  [React ]  ── CSS Modules, React Router, Axios
       │
       │  HTTP/HTTPS (JWT nos headers)
       ▼
  [FastAPI]
       │  ├── routers/    (auth, ubs, medicamentos, paciente, notificacoes)
       │  ├── models/     (SQLAlchemy ORM)
       │  ├── schemas/    (Pydantic)
       │  └── services/   (lógica de negócio)
       │
       ▼
  [PostgreSQL 16]  ── Alembic (migrations)
```

---

## 📁 Estrutura do Projeto

```
UBSFacil/
├── Database/
│   ├── seeds/
│   │   └── seeds.sql
│   └── schema.sql
│
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── database.py
│       ├── env
│       ├── main.py
│       ├── .gitignore
│       └── requirements.txt
│
├── docs/
│   ├── PullRequest
│   ├── cronograma_ubsfacil.html
│   └── plano_ubsfacil.html
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    └── vite.config.js
```

---

## 🔒 Segurança

- **bcrypt** para hash de senhas
- **Pydantic** para validação de dados em todas as rotas (proteção contra SQL Injection via ORM)
- **Princípio do menor privilégio** no usuário do banco PostgreSQL
- **HTTPS** com Certbot + Let's Encrypt e renovação automática
- **Variáveis de ambiente** para todas as credenciais — nenhum dado sensível versionado

**Gerar SECRET_KEY segura:**

```python
import secrets
print(secrets.token_hex(32))
```

---

## 📊 Status do Projeto

| Módulo | Status |
|--------|--------|
| Autenticação JWT | ✅ Completo |
| Busca de Medicamentos | ✅ Completo |
| UBSs — Listagem e Detalhes | ✅ Completo |
| Histórico de Retiradas | ✅ Completo |
| Interface Responsiva | ✅ Completo |
| Acessibilidade | ✅ Completo |
| Testes automatizados (pytest) | ✅ Completo |

---

## 🧪 Testes

```bash
cd backend/app

# Rodar todos os testes
pytest

# Com relatório de cobertura
pytest --cov=. --cov-report=term-missing

# Arquivo específico
pytest tests/test_auth.py -v
```

**Health check rápido:**

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Commit seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: adiciona minha feature"
   ```
4. Push e abra um Pull Request

**Tipos de commit:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

---

## 👥 Equipe

Desenvolvido com 💚 por:

| Nome | Área |
|------|------|
| **Bruno Pereira** | Frontend |
| **Vitor Hugo** | Frontend |
| **Amy Ribeiro** | Frontend  |
| **Igor Alves** | Backend |
| **Julio Oliveira** | Backend |
| **Kaleb Domingos** | Banco de Dados |
| **Alessandra Freitas** | Organização · Revisão de Pull Requests  |

---

## 🎯 Roadmap

### Fase 1 — MVP (Semanas 1–4) ✅
- [x] Setup do repositório e ambiente
- [x] Schema e seeds do banco
- [x] Estrutura base do backend (FastAPI + SQLAlchemy)
- [x] Telas principais do frontend
- [x] Autenticação JWT
- [x] Integração Frontend ↔ Backend ↔ Banco

### Fase 2 — Evolução (Semanas 5–8) ✅
- [x] UX/UI refinado e responsividade mobile
- [x] Sistema de notificações
- [x] Filtros avançados na busca
- [x] Testes automatizados com pytest
- [x] Revisão de segurança (rate limiting, JWT, bcrypt)
- [x] Validação em staging

### Fase 3 — Deploy (Semanas 9–12) ✅
- [x] Dockerfiles de produção (frontend e backend)
- [x] Deploy na VPS Hostinger
- [x] HTTPS com Certbot + Let's Encrypt
- [x] Backup automático do banco
- [x] Monitoramento com UptimeRobot
- [x] Documentação final e apresentação

### Futuro 🚀
- [ ] Busca por geolocalização
- [ ] Painel do gestor de UBS
- [ ] Notificações push em tempo real
- [ ] Aplicativo mobile (React Native)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — livre para usar, modificar e distribuir.

---

**⭐ Se este projeto foi útil, deixe uma estrela no repositório!**

