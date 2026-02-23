<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Extract ID from URL if necessary or from body
    // For simplicity, we'll assume the URL or body has it.
    // Let's check for ID in data.
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["message" => "ID is required"]);
        exit;
    }

    $fields = [];
    $values = [];

    if (isset($data['status'])) {
        $fields[] = "status = ?";
        $values[] = $data['status'];
    }

    if (isset($data['comment'])) {
        $fields[] = "comment = ?";
        $values[] = $data['comment'];
    }

    if (isset($data['title'])) {
        $fields[] = "title = ?";
        $values[] = $data['title'];
    }

    if (isset($data['description'])) {
        $fields[] = "description = ?";
        $values[] = $data['description'];
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["message" => "Nothing to update"]);
        exit;
    }

    $sql = "UPDATE tasks SET " . implode(", ", $fields) . " WHERE id = ?";
    $values[] = $data['id'];
    
    $stmt= $pdo->prepare($sql);
    $stmt->execute($values);

    // Logging to history
    $description = "Mise à jour:";
    if (isset($data['status'])) $description .= " Statut -> " . $data['status'] . ".";
    if (isset($data['comment'])) $description .= " Nouveau commentaire ajouté.";
    if (isset($data['title'])) $description .= " Titre modifié.";
    if (isset($data['description'])) $description .= " Description modifiée.";
    
    $stmtHistory = $pdo->prepare("INSERT INTO task_history (task_id, action_type, description) VALUES (?, 'UPDATE', ?)");
    $stmtHistory->execute([$data['id'], $description]);

    echo json_encode(["message" => "Task updated"]);
}
?>
