-- UBSFacil · Schema do Banco de Dados
-- Autor: Kalleb Domingos
-- Data: 2026-05-02

-- 1. Unidades (UBSs)
CREATE TABLE unidades (
    id       SERIAL PRIMARY KEY,
    nome     VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL
);

-- 2. Medicamentos
CREATE TABLE medicamentos (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- 3. Usuarios (Pacientes)
CREATE TABLE usuarios (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    cpf        VARCHAR(14)  NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL
);

-- 4. Admins
CREATE TABLE admins (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    senha_hash    VARCHAR(255) NOT NULL,
    codigo_acesso VARCHAR(20)  NOT NULL UNIQUE
);

-- 5. Estoque
CREATE TABLE estoque (
    id             SERIAL PRIMARY KEY,
    medicamento_id INT NOT NULL REFERENCES medicamentos(id),
    unidade_id     INT NOT NULL REFERENCES unidades(id),
    quantidade     INT NOT NULL DEFAULT 0,
    atualizado_em  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (medicamento_id, unidade_id)
);

-- 6. Retiradas
CREATE TABLE retiradas (
    id             SERIAL PRIMARY KEY,
    usuario_id     INT NOT NULL REFERENCES usuarios(id),
    medicamento_id INT NOT NULL REFERENCES medicamentos(id),
    unidade_id     INT NOT NULL REFERENCES unidades(id),
    retirado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);