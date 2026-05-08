from fastapi import FastAPI
from auth import router as auth_router

app = FastAPI(title="UBSFacil API", version="1.0.0")

app.include_router(auth_router)

@app.get("/")
def root():
    return {"mensagem": "API UBSFacil funcionando!"}