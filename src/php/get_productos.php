<?php
include 'db.php';

$q = isset($_GET['q']) ? $conn->real_escape_string($_GET['q']) : '';
$habilitadoFiltro = isset($_GET['habilitado']) && $_GET['habilitado'] !== '' ? (int) $_GET['habilitado'] : null;

$sql = "SELECT id, nombre, descripcion, imagen, habilitado FROM productos";
$filtros = [];

// 🔍 Filtro de búsqueda
if (!empty($q)) {
    $filtros[] = "(id LIKE '%$q%' OR 
                   nombre LIKE '%$q%' OR
                   descripcion LIKE '%$q%' OR 
                   imagen LIKE '%$q%')";
}

// 🔘 Filtro de habilitado
if ($habilitadoFiltro === 1) {
    $filtros[] = "habilitado = 1";
} elseif ($habilitadoFiltro === 0) {
    $filtros[] = "habilitado = 0";
}

// 👉 Si hay filtros, se agregan al SQL
if (!empty($filtros)) {
    $sql .= " WHERE " . implode(" AND ", $filtros);
}

$result = $conn->query($sql);
$productos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

echo json_encode($productos);
?>
