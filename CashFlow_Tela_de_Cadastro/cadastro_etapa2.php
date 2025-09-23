<?php
declare(strict_types=1);

// Sempre responder JSON (e não vazar notices/HTML)
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Conexão
    require_once __DIR__ . '/../conexao.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
        exit;
    }

    if (empty($_SESSION['usuario_id'])) {
        throw new RuntimeException('Sessão expirada. Refaça o cadastro (etapa 1).');
    }

    $usuario_id       = (int) $_SESSION['usuario_id'];
    $cep              = trim($_POST['cep'] ?? '');
    $logradouro       = trim($_POST['logradouro'] ?? '');
    $complemento      = trim($_POST['complemento'] ?? '');
    $bairro           = trim($_POST['bairro'] ?? '');
    $cidade           = trim($_POST['cidade'] ?? '');
    $estado           = trim($_POST['estado'] ?? '');
    $tipo_residencia  = trim($_POST['tipo_residencia'] ?? '');
    $tempo_residencia = trim($_POST['tempo_residencia'] ?? '');

    // Validação mínima
    if ($cep === '' || $logradouro === '' || $bairro === '' || $cidade === '' || $estado === '') {
        throw new InvalidArgumentException('Preencha todos os campos obrigatórios.');
    }

    // Dica: ViaCEP retorna UF (DF, SP...), então 'estado' deve ser 2 letras (CHAR(2))
    if (strlen($estado) !== 2) {
        throw new InvalidArgumentException('Estado inválido. Selecione a UF (ex.: DF, SP).');
    }

    // INSERT endereço
    $sql = "INSERT INTO usuarios_enderecos
            (usuario_id, cep, logradouro, complemento, bairro, cidade, estado, tipo_residencia, tempo_residencia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssssss",
        $usuario_id, $cep, $logradouro, $complemento, $bairro, $cidade, $estado, $tipo_residencia, $tempo_residencia
    );
    $stmt->execute();
    $stmt->close();

    // Atualiza progresso
    $up = $conn->prepare("UPDATE usuarios SET etapa = 2 WHERE id = ?");
    $up->bind_param("i", $usuario_id);
    $up->execute();
    $up->close();

    echo json_encode(['status' => 'success', 'message' => 'Endereço salvo com sucesso!']);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
