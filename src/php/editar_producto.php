<?php
include 'db.php'; // Asegúrate de que la ruta sea correcta

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;

    if (!$id) {
        echo json_encode(["success" => false, "error" => "ID no válido"]);
        exit;
    }

    $habilitado = isset($_POST['habilitado']) ? intval($_POST['habilitado']) : null;

    // Procesar la imagen
    $imagenUrl = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $nombreArchivo = uniqid() . "_" . basename($_FILES["imagen"]["name"]);
        $directorioDestino = "../../uploads/" . $nombreArchivo;

        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $directorioDestino)) {
            $imagenUrl = "https://white-jay-917240.hostingersite.com/uploads/" . $nombreArchivo;
        } else {
            echo json_encode(["success" => false, "error" => "Error al subir la imagen."]);
            exit;
        }
    } else {
        $imagenUrl = isset($_POST['imagenUrlActual']) ? $_POST['imagenUrlActual'] : null;
    }

    // Obtener nombre y descripción
    $nombre = isset($_POST['nombre']) ? $conn->real_escape_string($_POST['nombre']) : null;
    $descripcion = isset($_POST['descripcion']) ? $conn->real_escape_string($_POST['descripcion']) : null;

    // Preparar sentencia
    $stmt = $conn->prepare("UPDATE productos 
        SET nombre = ?, descripcion = ?, habilitado = ?, imagen = ?
        WHERE id = ?");

    $stmt->bind_param("ssisi", $nombre, $descripcion, $habilitado, $imagenUrl, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
}

$conn->close();
