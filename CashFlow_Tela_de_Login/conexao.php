<?php
$host = "localhost";
$usuario = "root";     // ajuste para seu MySQL
$senha = "";           // senha do MySQL
$banco = "cashflow";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}
?>
