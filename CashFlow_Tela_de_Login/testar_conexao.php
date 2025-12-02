<?php
$host = "localhost";   // servidor
$usuario = "root";     // seu usuário do MySQL
$senha = "";           // senha do MySQL (se houver)
$banco = "cashflow";   // nome do banco que você criou

// Criar conexão
$conn = new mysqli($host, $usuario, $senha, $banco);

// Testar conexão
if ($conn->connect_error) {
    die("❌ Erro na conexão: " . $conn->connect_error);
} else {
    echo "✅ Conexão bem-sucedida com o banco '$banco'!";
}

// Fechar conexão
$conn->close();
?>
