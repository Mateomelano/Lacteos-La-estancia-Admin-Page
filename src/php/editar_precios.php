<?php
include("db.php");

$ids = $_POST['ids'];
$nuevoPrecio = $_POST['nuevoPrecio'];
$nuevoPrecioMayorista = $_POST['nuevoPrecioMayorista'];

if (!is_array($ids)) {
    $ids = explode(",", $ids);
}

$idsLimpios = array_map('intval', $ids); // sanitizar

$idList = implode(",", $idsLimpios);

// Usamos directamente los valores como constantes porque no podemos usar bind_param con un número variable de IDs.
$sql = "UPDATE productos SET precio = ?, preciomayorista = ? WHERE id IN ($idList)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dd", $nuevoPrecio, $nuevoPrecioMayorista);

if ($stmt->execute()) {
    echo "OK";
} else {
    http_response_code(500);
    echo "Error al actualizar los precios";
}
?>
