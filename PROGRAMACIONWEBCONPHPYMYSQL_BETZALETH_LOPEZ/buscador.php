<?php
header('Content-Type: application/json; charset=utf-8');

$jsonFile = __DIR__ . '/data-1.json';

if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'No se encuentra el archivo data-1.json']);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

// 1. Obtener opciones para los selects
if ($action == 'getOptions') {
    $ciudades = array();
    $tipos = array();

    foreach ($data as $item) {
        if (isset($item['Ciudad']) && !in_array($item['Ciudad'], $ciudades)) {
            $ciudades[] = $item['Ciudad'];
        }
        if (isset($item['Tipo']) && !in_array($item['Tipo'], $tipos)) {
            $tipos[] = $item['Tipo'];
        }
    }

    sort($ciudades);
    sort($tipos);

    echo json_encode(array(
        'ciudades' => $ciudades,
        'tipos' => $tipos
    ));
    exit;
}

// 2. Realizar la búsqueda y filtrado
if ($action == 'buscar' || isset($_POST['accion']) || !empty($_POST)) {
    $mostrarTodos = isset($_POST['mostrarTodos']) && $_POST['mostrarTodos'] === 'true';
    $ciudadSel = isset($_POST['ciudad']) ? trim($_POST['ciudad']) : '';
    $tipoSel = isset($_POST['tipo']) ? trim($_POST['tipo']) : '';
    
    $precioMin = isset($_POST['precioMin']) ? floatval($_POST['precioMin']) : 0;
    $precioMax = isset($_POST['precioMax']) ? floatval($_POST['precioMax']) : PHP_INT_MAX;

    $resultados = array();

    foreach ($data as $item) {
        // Limpiar el formato del precio del JSON (ej: "$30,746" -> 30746)
        $precioLimpio = floatval(preg_replace('/[^\d.]/', '', $item['Precio']));

        if ($mostrarTodos) {
            $resultados[] = $item;
            continue;
        }

        $cumpleCiudad = ($ciudadSel === '' || $item['Ciudad'] === $ciudadSel);
        $cumpleTipo = ($tipoSel === '' || $item['Tipo'] === $tipoSel);
        $cumplePrecio = ($precioLimpio >= $precioMin && $precioLimpio <= $precioMax);

        if ($cumpleCiudad && $cumpleTipo && $cumplePrecio) {
            $resultados[] = $item;
        }
    }

    echo json_encode($resultados);
    exit;
}
?>