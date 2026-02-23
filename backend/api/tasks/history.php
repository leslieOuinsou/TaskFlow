<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $taskId = $_GET['task_id'] ?? null;
    if (!$taskId) {
        http_response_code(400);
        echo json_encode(["message" => "Task ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM task_history WHERE task_id = ? ORDER BY created_at DESC");
    $stmt->execute([$taskId]);
    echo json_encode($stmt->fetchAll());
}
?>
