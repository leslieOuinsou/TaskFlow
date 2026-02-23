<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $taskId = $_GET['task_id'] ?? null;
    if (!$taskId) {
        http_response_code(400);
        echo json_encode(["message" => "Task ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT c.*, u.full_name, u.username 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.task_id = ? 
        ORDER BY c.created_at ASC
    ");
    $stmt->execute([$taskId]);
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['task_id']) || !isset($data['user_id']) || !isset($data['content'])) {
        http_response_code(400);
        echo json_encode(["message" => "Missing data"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$data['task_id'], $data['user_id'], $data['content']]);
    
    echo json_encode(["message" => "Comment added", "id" => $pdo->lastInsertId()]);
}
?>
