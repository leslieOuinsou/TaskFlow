<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

require_once __DIR__ . '/../../config.php';

// GET /api/notifications.php?user_id=X
// Returns all notifications for a user
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(["message" => "user_id requis"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT n.*, t.title as task_title
        FROM notifications n
        LEFT JOIN tasks t ON n.task_id = t.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
        LIMIT 50
    ");
    $stmt->execute([$user_id]);
    $notifications = $stmt->fetchAll();

    $unread = array_filter($notifications, fn($n) => !$n['is_read']);
    echo json_encode([
        "notifications" => $notifications,
        "unread_count"  => count($unread),
    ]);
}

// PATCH /api/notifications.php — mark as read
// Body: { "id": X } or { "user_id": X, "mark_all": true }
elseif ($method === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['mark_all']) && $data['mark_all'] && isset($data['user_id'])) {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$data['user_id']]);
        echo json_encode(["message" => "Toutes les notifications marquées comme lues"]);
    } elseif (isset($data['id'])) {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(["message" => "Notification marquée comme lue"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Paramètres manquants"]);
    }
}
?>
