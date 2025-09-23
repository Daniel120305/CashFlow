<?php
session_start();
include "conexao.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $senha = trim($_POST["senha"]);

    $sql = "SELECT id, nome, email, senha FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();

        // Verifica a senha criptografada
        if (password_verify($senha, $usuario["senha"])) {
            $_SESSION["usuario_id"] = $usuario["id"];
            $_SESSION["usuario_nome"] = $usuario["nome"];

            echo json_encode(["status" => "success", "message" => "Login realizado com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Senha incorreta."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuário não encontrado."]);
    }

    $stmt->close();
    $conn->close();
}
?>
