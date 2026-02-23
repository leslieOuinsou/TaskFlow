<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

if ($method === 'GET') {
    // List archived tasks
    $stmt = $pdo->query("SELECT * FROM tasks WHERE archived_at IS NOT NULL ORDER BY archived_at DESC");
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    $id = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID manquant"]);
        exit;
    }

    if ($action === 'archive') {
        $stmt = $pdo->prepare("UPDATE tasks SET archived_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Tâche archivée"]);
    } elseif ($action === 'restore') {
        $stmt = $pdo->prepare("UPDATE tasks SET archived_at = NULL WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Tâche restaurée"]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID manquant"]);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND archived_at IS NOT NULL");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Tâche supprimée définitivement"]);
}
?>
