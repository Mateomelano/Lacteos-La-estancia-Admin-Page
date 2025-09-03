<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = isset($_POST['nombre']) ? $conn->real_escape_string($_POST['nombre']) : '';
    $descripcion = isset($_POST['descripcion']) ? $conn->real_escape_string($_POST['descripcion']) : '';
    $habilitado = isset($_POST['habilitado']) ? intval($_POST['habilitado']) : 0;

    // Subida de imagen al servidor
    $rutaImagen = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $nombreArchivo = uniqid() . "_" . basename($_FILES["imagen"]["name"]);
        $directorioDestino = "../../uploads/" . $nombreArchivo;

        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $directorioDestino)) {
            $rutaImagen = "https://purple-sheep-451734.hostingersite.com/uploads/" . $nombreArchivo;
        } else {
            echo json_encode(["status" => "error", "message" => "Error al subir la imagen"]);
            exit;
        }
    }

    // Insertar en la base de datos
    $sql = "INSERT INTO productos (nombre, descripcion, habilitado, imagen) 
            VALUES ('$nombre', '$descripcion', '$habilitado', '$rutaImagen')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Producto agregado"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>
