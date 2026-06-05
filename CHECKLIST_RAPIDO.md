# 🚀 Checklist Rápido - Semana 4/5

## ✅ PRONTO PARA TESTAR

### Backend (Igor/Julio)
```bash
cd backend
python -m uvicorn app.main:app --reload
```
**Testar em:** http://localhost:8000/docs

- [ ] POST /auth/login com email + senha
- [ ] GET /auth/me com token válido
- [ ] Verificar se token é retornado

### Frontend (Kalleb)
```bash
cd frontend
npm run dev
```
**Acessa:** http://localhost:5173

- [ ] Página carrega sem erros
- [ ] Abrir console (F12) - sem red errors
- [ ] Testar Login.jsx quando backend estiver rodando

---

## 🔧 Estrutura de Comandos

| O que fazer | Comando |
|-------------|---------|
| Instalar deps backend | `cd backend && pip install -r requirements.txt` |
| Rodar backend | `cd backend && python -m uvicorn app.main:app --reload` |
| Gerar nova migration | `cd backend && python -m alembic revision --autogenerate -m "descricao"` |
| Aplicar migrations | `cd backend && python -m alembic upgrade head` |
| Instalar deps frontend | `cd frontend && npm install` |
| Rodar frontend | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |

---

## 📡 Endpoints Backend Prontos

| Método | Rota | O que faz | Status |
|--------|------|----------|--------|
| POST | /auth/login | Autenticação | ✅ |
| GET | /auth/me | Dados do usuário | ✅ |
| GET | /medicamentos | Lista medicamentos | ⏳ |
| GET | /unidades | Lista UBSs | ⏳ |
| GET | /paciente/historico | Histórico de retiradas | ⏳ |

---

## 🎯 Próximas Ações por Membro

### Igor (Autenticação)
1. Testar POST /auth/login
2. Implementar seeds com usuários
3. Confirmar JWT funcionando

### Julio (Rotas)
1. Implementar GET /medicamentos
2. Implementar GET /unidades
3. Implementar GET /paciente/historico

### Kaleb (Frontend)
1. ✅ npm install (FEITO)
2. Testar Login.jsx
3. Conectar componentes aos hooks
4. Integrar geolocalização

---

## 🔐 Senhas & Chaves

**Banco de Dados:**
- Host: localhost
- Usuario: postgres
- Senha: Kalleb#2008
- Banco: ubsfacil

**Variáveis de Ambiente:**
- Backend: DATABASE_URL, SECRET_KEY (em .env)
- Frontend: VITE_API_URL (em .env)

⚠️ **NUNCA commitar .env!**

---

## 📂 Pastas Importantes

```
backend/               ← FastAPI
├── app/routers/auth.py          ← Rotas JWT aqui
└── app/services/auth_service.py ← Lógica JWT

frontend/              ← React
├── src/services/api.js          ← Axios aqui
└── src/hooks/useAuth.js         ← useAuth aqui

Database/              ← Alembic
└── migrations/versions/          ← Versões aqui
```

---

## 🐛 Se algo der errado

**Frontend não carrega:**
```bash
cd frontend
rm -r node_modules
npm install
npm run dev
```

**Backend não conecta ao banco:**
```bash
# Verificar .env
cat backend/.env
# Verificar se PostgreSQL está rodando
# Verificar senha
```

**JWT não funciona:**
```bash
# Verificar SECRET_KEY em backend/.env
# Verificar se token está em Authorization header
```

---

## 📞 Referência Rápida

**Arquivo de Integração:** `frontend/INTEGRATION_GUIDE.md`  
**Status Completo:** `SEMANA_4_5_STATUS.md`  
**API Axios:** `frontend/src/services/api.js`  
**Auth Hook:** `frontend/src/hooks/useAuth.js`

---

**Última atualização:** 04/06/2026 
