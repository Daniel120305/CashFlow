<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include __DIR__ . "/../conexao.php";
 // conexão com MySQL

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome       = trim($_POST["nome"]);
    $cpf        = trim($_POST["cpf"]);
    $nascimento = trim($_POST["nascimento"]);
    $telefone   = trim($_POST["telefone"]);
    $email      = trim($_POST["email"]);
    $senha      = trim($_POST["senha"]);
    $confirma   = trim($_POST["confirmar_senha"]);

    // Validações básicas
    if (empty($nome) || empty($cpf) || empty($nascimento) || empty($telefone) || empty($email) || empty($senha) || empty($confirma)) {
        echo json_encode(["status" => "error", "message" => "Preencha todos os campos obrigatórios."]);
        exit;
    }

    if ($senha !== $confirma) {
        echo json_encode(["status" => "error", "message" => "As senhas não coincidem."]);
        exit;
    }

    // Criptografa senha
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere no banco
    $sql = "INSERT INTO usuarios (nome, cpf, nascimento, telefone, email, senha, etapa) VALUES (?, ?, ?, ?, ?, ?, 1)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $nome, $cpf, $nascimento, $telefone, $email, $senhaHash);

    if ($stmt->execute()) {
        // guarda ID na sessão para continuar na próxima etapa
        $_SESSION["usuario_id"] = $stmt->insert_id;
        echo json_encode(["status" => "success", "message" => "Etapa 1 concluída!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erro: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
