<?php
header("Content-Type: application/json");
file_put_contents("C:/Users/Jordan/Desktop/Taskflow/backend/hit.log", "[" . date('Y-m-d H:i:s') . "] " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

require_once '../../config.php';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $search = $_GET['search'] ?? '';
    
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        $task = $stmt->fetch();
        if ($task) {
            echo json_encode($task);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Task not found"]);
        }
    } elseif ($search) {
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE title LIKE ? AND archived_at IS NULL ORDER BY created_at DESC");
        $stmt->execute(["%$search%"]);
        echo json_encode($stmt->fetchAll());
    } else {
        $stmt = $pdo->query("SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
    }
} elseif ($method === 'POST') {
    $raw_input = file_get_contents("php://input");
    file_put_contents("C:/Users/Jordan/Desktop/Taskflow/backend/api/tasks/debug.log", "[" . date('Y-m-d H:i:s') . "] POST data: " . $raw_input . "\n", FILE_APPEND);
    $data = json_decode($raw_input, true);
    
    if (!isset($data['title']) || empty($data['title'])) {
        http_response_code(400);
        echo json_encode(["message" => "Title is required"]);
        exit;
    }

    $sql = "INSERT INTO tasks (title, description, priority, service, user_id) VALUES (?, ?, ?, ?, ?)";
    $stmt= $pdo->prepare($sql);
    $stmt->execute([
        $data['title'],
        $data['description'] ?? '',
        $data['priority'] ?? 'Normale',
        $data['service'] ?? '',
        $data['user_id'] ?? null
    ]);

    $taskId  = $pdo->lastInsertId();
    $service = $data['service'] ?? '';
    $title   = $data['title'];
    $message = "📋 Nouvelle tâche : \"$title\"" . ($service ? " — Service : $service" : '');

    // Notify all users of the concerned service
    if (!empty($service)) {
        $users = $pdo->prepare("SELECT id FROM users WHERE service = ?");
        $users->execute([$service]);
        $notif = $pdo->prepare("INSERT INTO notifications (user_id, task_id, message) VALUES (?, ?, ?)");
        foreach ($users->fetchAll() as $u) {
            $notif->execute([$u['id'], $taskId, $message]);
        }
    }

    echo json_encode(["message" => "Task created", "id" => $taskId]);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID is required"]);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Task deleted"]);
}
?>
