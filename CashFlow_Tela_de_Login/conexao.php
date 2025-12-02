<?php
$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "cashflow";
$port = 3307;

$conn = new mysqli($host, $usuario, $senha, $banco, $port);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}
?>
