-- MEDICAMENTOS
INSERT INTO medicamentos (nome, categoria, forma) VALUES
('Dipirona', 'Analgésico', 'Comprimido'),
('Paracetamol', 'Analgésico', 'Comprimido'),
('Ibuprofeno', 'Anti-inflamatório', 'Comprimido'),
('Omeprazol', 'Gastroprotetor', 'Cápsula'),
('Losartana', 'Anti-hipertensivo', 'Comprimido'),
('Hidroclorotiazida', 'Diurético', 'Comprimido'),
('Atenolol', 'Anti-hipertensivo', 'Comprimido'),
('Metformina', 'Antidiabético', 'Comprimido'),
('Insulina Humana', 'Antidiabético', 'Injetável'),
('AAS', 'Antiagregante plaquetário', 'Comprimido'),
('Sinvastatina', 'Hipolipemiante', 'Comprimido'),
('Levotiroxina', 'Hormônio tireoidiano', 'Comprimido'),
('Salbutamol', 'Broncodilatador', 'Aerossol'),
('Nimesulida', 'Anti-inflamatório', 'Comprimido'),
('Maleato de Dexclorfeniramina', 'Antialérgico', 'Xarope');

-- UNIDADES
INSERT INTO unidades (nome, endereco, bairro) VALUES
('UBS Centro', 'Rua A, 123', 'Centro'),
('UBS Jardim das Flores', 'Av. B, 456', 'Jardim das Flores'),
('UBS Vila Nova', 'Rua C, 789', 'Vila Nova'),
('Farmácia Popular Central', 'Rua D, 101', 'Centro');

-- USUARIOS
INSERT INTO usuarios (nome, cpf, email, sus_cartao, senha_hash) VALUES
('Ana Souza', '123.456.789-00', 'ana@email.com', '123456789012345', 'hash_provisorio'),
('Carlos Lima', '234.567.890-11', 'carlos@email.com', '234567890123456', 'hash_provisorio'),
('Mariana Alves', '345.678.901-22', 'mariana@email.com', '345678901234567', 'hash_provisorio'),
('João Pereira', '456.789.012-33', 'joao@email.com', '456789012345678', 'hash_provisorio'),
('Patrícia Rocha', '567.890.123-44', 'patricia@email.com', '567890123456789', 'hash_provisorio');

-- ADMINS
INSERT INTO admins (nome, email, codigo_acesso) VALUES
('Igor Alves', 'igor@ubsfacil.com', 'ADM-101'),
('Alessandra Freitas', 'alessandra@ubsfacil.com', 'ADM-202');

-- ESTOQUE
INSERT INTO estoque (medicamento_id, unidade_id, quantidade) VALUES
(1, 1, 30),
(2, 1, 0),
(3, 2, 18),
(4, 2, 12),
(5, 1, 25),
(6, 3, 9),
(7, 3, 14),
(8, 2, 22),
(9, 4, 7),
(10, 1, 16),
(11, 4, 11),
(12, 3, 6),
(13, 2, 8),
(14, 1, 4),
(15, 4, 10);