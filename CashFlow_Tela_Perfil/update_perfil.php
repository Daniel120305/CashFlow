<?php
header('Content-Type: application/json; charset=utf-8');
include "../conexao.php"; // ajuste o caminho

session_start();
if (empty($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "error", "message" => "Usuário não autenticado."]);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];

// Dados pessoais
$nome        = $_POST['nome'] ?? '';
$cpf         = $_POST['cpf'] ?? '';
$nascimento  = $_POST['nascimento'] ?? '';
$telefone    = $_POST['telefone'] ?? '';
$email       = $_POST['email'] ?? '';

// Endereço
$cep             = $_POST['cep'] ?? '';
$logradouro      = $_POST['logradouro'] ?? '';
$complemento     = $_POST['complemento'] ?? '';
$bairro          = $_POST['bairro'] ?? '';
$cidade          = $_POST['cidade'] ?? '';
$estado          = $_POST['estado'] ?? '';
$tipo_residencia = $_POST['tipo_residencia'] ?? '';
$tempo_residencia= $_POST['tempo_residencia'] ?? '';

// Financeiro
$renda            = $_POST['renda'] ?? '';
$despesas         = $_POST['despesas'] ?? '';
$tipo_investimento= $_POST['tipo_investimento'] ?? '';
$faixa_investimento= $_POST['faixa_investimento'] ?? '';

// Atualiza usuários
$stmt = $conn->prepare("UPDATE usuarios SET nome=?, cpf=?, nascimento=?, telefone=?, email=? WHERE id=?");
$stmt->bind_param("sssssi", $nome, $cpf, $nascimento, $telefone, $email, $usuario_id);
$stmt->execute();
$stmt->close();

// Atualiza endereço
$stmt = $conn->prepare("UPDATE usuarios_enderecos SET cep=?, logradouro=?, complemento=?, bairro=?, cidade=?, estado=?, tipo_residencia=?, tempo_residencia=? WHERE usuario_id=?");
$stmt->bind_param("ssssssssi", $cep, $logradouro, $complemento, $bairro, $cidade, $estado, $tipo_residencia, $tempo_residencia, $usuario_id);
$stmt->execute();
$stmt->close();

// Atualiza financeiro
$stmt = $conn->prepare("UPDATE usuarios_financeiro SET renda=?, despesas=?, tipo_investimento=?, faixa_investimento=? WHERE usuario_id=?");
$stmt->bind_param("ssssi", $renda, $despesas, $tipo_investimento, $faixa_investimento, $usuario_id);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success", "message" => "Dados atualizados com sucesso!"]);
$conn->close();
?>
