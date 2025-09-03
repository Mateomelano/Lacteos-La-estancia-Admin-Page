<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json; charset=utf-8');

// Limpiar cualquier salida inesperada
ob_start();

try {
    require __DIR__ . '/db.php';

    $usuario = $_POST['usuario'] ?? '';
    $password = $_POST['password'] ?? '';

    error_log("LOGIN: usuario='$usuario' password='$password'");

    $stmt = $conn->prepare('SELECT password FROM usuarios WHERE usuario = ?');
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $res = $stmt->get_result();

    $ok = false;
    if ($row = $res->fetch_assoc()) {
        $ok = hash_equals($row['password'], $password); // Comparación en texto plano
        error_log($ok ? "✅ Login exitoso" : "❌ Contraseña incorrecta");
        if ($ok) {
            $_SESSION['loggedIn'] = true;  // ✅ ACÁ SE SETEA LA SESIÓN
        }
    } else {
        error_log("❌ Usuario no encontrado: $usuario");
    }

    $salida = json_encode([
        'success' => $ok,
        'message' => $ok ? null : 'Usuario o contraseña incorrectos'
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    error_log('verificar_login: ' . $e->getMessage());
    $salida = json_encode([
        'success' => false,
        'message' => 'Error del servidor'
    ]);
}

$ruido = trim(ob_get_clean());
if ($ruido !== '') {
    error_log("❗ Ruido inesperado en la salida: " . $ruido);
    echo json_encode([
        'success' => false,
        'message' => "Ruido inesperado: $salida"
    ]);
} else {
    echo $salida;
}
