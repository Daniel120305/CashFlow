use cashflow;
CREATE TABLE usuarios_financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    renda VARCHAR(50) NOT NULL,
    despesas VARCHAR(50) NOT NULL,
    menor_18 TINYINT(1) NOT NULL DEFAULT 0,
    tipo_investimento VARCHAR(50) NOT NULL,
    faixa_investimento VARCHAR(50) NOT NULL,
    objetivo TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_financeiro_usuario 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) 
        ON DELETE CASCADE
);
