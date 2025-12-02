<?php
header('Content-Type: application/json');
include "conexao.php";

$user_id = $_GET['id'] ?? null;

if (!$user_id) {
    header('Content-Type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    echo json_encode(["status" => "error", "message" => "ID do usuário não fornecido."]);
    exit;
}

// Dados pessoais
$sql_user = "SELECT nome, cpf, nascimento, telefone, email FROM usuarios WHERE id = ?";
$stmt_user = $conn->prepare($sql_user);
$stmt_user->bind_param("i", $user_id);
$stmt_user->execute();
$result_user = $stmt_user->get_result();
$dados_user = $result_user->fetch_assoc();
$stmt_user->close();

// Endereço
$sql_endereco = "SELECT cep, logradouro, complemento, bairro, cidade, estado, tipo_residencia, tempo_residencia FROM usuarios_enderecos WHERE usuario_id = ?";
$stmt_end = $conn->prepare($sql_endereco);
$stmt_end->bind_param("i", $user_id);
$stmt_end->execute();
$result_end = $stmt_end->get_result();
$dados_endereco = $result_end->fetch_assoc();
$stmt_end->close();

// Financeiro
$sql_fin = "SELECT renda, despesas, tipo_investimento, faixa_investimento FROM usuarios_financeiro WHERE usuario_id = ?";
$stmt_fin = $conn->prepare($sql_fin);
$stmt_fin->bind_param("i", $user_id);
$stmt_fin->execute();
$result_fin = $stmt_fin->get_result();
$dados_financeiro = $result_fin->fetch_assoc();
$stmt_fin->close();

$conn->close();

// Combina tudo
echo json_encode([
    "status" => "success",
    "dados" => array_merge($dados_user ?? [], $dados_endereco ?? [], $dados_financeiro ?? [])
]);
?>
