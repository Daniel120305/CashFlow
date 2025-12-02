<?php
// seed.php
// Script para criar tabela de usuários (se necessário) e inserir usuários de teste.
// USO: coloque este arquivo na pasta do projeto e acesse pelo navegador ou rode `php seed.php`.
// APÓS USAR: REMOVA ou PROTEJA este arquivo (contém senhas de teste em texto simples).

$host = "localhost";
$user = "root";
$pass = "";        // ajuste se precisar
$dbname = "cashflow"; // ajuste se seu DB tiver outro nome

// Conexão
$conn = new mysqli($host, $user, $pass);

// Verifica conexão com servidor MySQL
if ($conn->connect_error) {
    die("Erro de conexão ao MySQL: " . $conn->connect_error . PHP_EOL);
}

// Cria banco se não existir e seleciona
$sqlCreateDb = "CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!$conn->query($sqlCreateDb)) {
    die("Erro ao criar/selecionar banco: " . $conn->error . PHP_EOL);
}

$conn->select_db($dbname);

// Cria tabela usuarios se não existir
$sqlCreateTable = "
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

if (!$conn->query($sqlCreateTable)) {
    die("Erro ao criar tabela: " . $conn->error . PHP_EOL);
}

// Lista de usuários de teste (email => senha_plain)
$users = [
    "admin@cashflow.com"   => "123456",
    "usuario@demo.com"     => "demo123",
    "teste@cashflow.com"   => "teste123",
    "financeiro@cf.com"    => "fin2025!",
    "analista@cf.com"      => "analise#1",
    "cliente1@cf.com"      => "cliente01",
    "cliente2@cf.com"      => "cliente02",
    "suporte@cf.com"       => "suporte888"
];

// Prepara o statement de inserção
$stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
if (!$stmt) {
    die("Erro ao preparar statement: " . $conn->error . PHP_EOL);
}

// Função para transformar email em nome amigável (ex: admin@... => Admin)
function prettyName($email) {
    $part = explode('@', $email)[0];
    $part = str_replace(['.', '_', '-'], ' ', $part);
    return ucwords($part);
}

$inseridos = [];
$ignorados = [];

foreach ($users as $email => $plain) {
    // verifica se já existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $res = $check->get_result();

    if ($res && $res->num_rows > 0) {
        // já existe — não re-inserir
        $ignorados[] = $email;
        $check->close();
        continue;
    }
    $check->close();

    $nome = prettyName($email);
    $hash = password_hash($plain, PASSWORD_DEFAULT);

    $stmt->bind_param("sss", $nome, $email, $hash);
    if ($stmt->execute()) {
        $inseridos[] = ['nome' => $nome, 'email' => $email, 'senha' => $plain];
    } else {
        echo "Erro ao inserir $email: " . $stmt->error . PHP_EOL;
    }
}

$stmt->close();
$conn->close();

// Saída amigável (HTML se acessado via navegador; também funciona no terminal)
if (php_sapi_name() === 'cli') {
    echo PHP_EOL . "=== RESULTADO ===" . PHP_EOL;
    if ($inseridos) {
        echo "Inseridos:\n";
        foreach ($inseridos as $u) {
            echo "- {$u['nome']} | {$u['email']} | senha: {$u['senha']}\n";
        }
    } else {
        echo "Nenhum usuário novo inserido.\n";
    }
    if ($ignorados) {
        echo "\nIgnorados (já existiam):\n";
        foreach ($ignorados as $e) echo "- $e\n";
    }
    echo PHP_EOL . "ATENÇÃO: Remova este arquivo após os testes." . PHP_EOL;
} else {
    echo "<!doctype html><html><head><meta charset='utf-8'><title>Seed - Cashflow</title></head><body style='font-family:Arial,Helvetica,sans-serif;padding:20px;'>";
    echo "<h2>Usuários de teste inseridos</h2>";
    if ($inseridos) {
        echo "<table border='1' cellpadding='8' style='border-collapse:collapse'><tr><th>Nome</th><th>Email</th><th>Senha (texto)</th></tr>";
        foreach ($inseridos as $u) {
            echo "<tr><td>{$u['nome']}</td><td>{$u['email']}</td><td><strong>{$u['senha']}</strong></td></tr>";
        }
        echo "</table>";
    } else {
        echo "<p>Nenhum usuário novo foi inserido (talvez já existam no banco).</p>";
    }

    if ($ignorados) {
        echo "<h3>Ignorados (já existiam)</h3><ul>";
        foreach ($ignorados as $e) echo "<li>$e</li>";
        echo "</ul>";
    }

    echo "<p style='color:#b00'><strong>IMPORTANTE:</strong> Exclua ou proteja este arquivo (seed.php) depois de usar.</p>";
    echo "</body></html>";
}
?>
