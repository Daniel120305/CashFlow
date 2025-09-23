<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // AJUSTE O CAMINHO SEU conexao.php ESTIVER EM OUTRO LUGAR
    require_once __DIR__ . '/../conexao.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
        exit;
    }

    if (empty($_SESSION['usuario_id'])) {
        // Para testar localmente sem a etapa 1, descomente a linha abaixo e defina um ID válido.
        // $_SESSION['usuario_id'] = 1;
        throw new RuntimeException('Sessão expirada. Refaça o cadastro (etapa 1).');
    }

    $usuario_id         = (int) $_SESSION['usuario_id'];
    $renda_raw          = trim($_POST['renda'] ?? '');
    $despesas_raw       = trim($_POST['despesas'] ?? '');
    $menor_18           = isset($_POST['menor_18']) ? 1 : 0;
    $tipo_investimento  = trim($_POST['tipo_investimento'] ?? '');
    $faixa_investimento = trim($_POST['faixa_investimento'] ?? '');

    if ($renda_raw === '' || $despesas_raw === '' || $tipo_investimento === '' || $faixa_investimento === '') {
        throw new InvalidArgumentException('Preencha todos os campos obrigatórios.');
    }

    // Normaliza "R$ 1.234,56" -> "1234.56"
    $brToDecimal = static function(string $v): string {
        $v = preg_replace('/[^0-9,.\-]/', '', $v); // mantém números e , . -
        $v = str_replace('.', '', $v);             // tira milhar
        $v = str_replace(',', '.', $v);            // virgula -> ponto
        if ($v === '' || $v === '.' || $v === '-') return '0.00';
        return number_format((float)$v, 2, '.', '');
    };

    $renda    = $brToDecimal($renda_raw);
    $despesas = $brToDecimal($despesas_raw);

    // INSERT
    $sql = "INSERT INTO usuarios_financeiro
            (usuario_id, renda, despesas, menor_18, tipo_investimento, faixa_investimento)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    // tipos: i (int), s (string), s (string/decimal), i, s, s
    $stmt->bind_param("ississ", $usuario_id, $renda, $despesas, $menor_18, $tipo_investimento, $faixa_investimento);
    $stmt->execute();
    $stmt->close();

    // Atualiza etapa do usuário
    $up = $conn->prepare("UPDATE usuarios SET etapa = 3 WHERE id = ?");
    $up->bind_param("i", $usuario_id);
    $up->execute();
    $up->close();

    echo json_encode(['status' => 'success', 'message' => 'Dados financeiros salvos com sucesso!']);
} catch (Throwable $e) {
    http_response_code(500);
    // Loga no error_log do PHP (útil em dev)
    error_log('cadastro_etapa3.php ERROR: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
