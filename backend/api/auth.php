<?php
header("Content-Type: application/json");
file_put_contents("../hit.log", "[" . date('Y-m-d H:i:s') . "] " . $_SERVER['REQUEST_METHOD'] . " AUTH " . ($_GET['action'] ?? 'none') . "\n", FILE_APPEND);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

require_once '../config.php';

if ($method === 'POST') {
    $raw_input = file_get_contents("php://input");
    file_put_contents("debug_auth.log", "[" . date('Y-m-d H:i:s') . "] AUTH data: " . $raw_input . "\n", FILE_APPEND);
    $data = json_decode($raw_input, true);
    $action = $_GET['action'] ?? '';

    if ($action === 'register') {
        if (!isset($data['username']) || !isset($data['password']) || !isset($data['full_name']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(["message" => "Données manquantes"]);
            exit;
        }

        if (strlen($data['password']) < 12) {
            http_response_code(400);
            echo json_encode(["message" => "Le mot de passe doit contenir au moins 12 caractères."]);
            exit;
        }

        $hash = password_hash($data['password'], PASSWORD_DEFAULT);
        try {
            $stmt = $pdo->prepare("INSERT INTO users (full_name, email, username, password, service) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$data['full_name'], $data['email'], $data['username'], $hash, $data['service'] ?? '']);
            echo json_encode(["message" => "Utilisateur créé"]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["message" => "Nom d'utilisateur ou email déjà pris"]);
        }
    } elseif ($action === 'login') {
        if (strlen($data['password'] ?? '') < 12) {
            http_response_code(401);
            echo json_encode(["message" => "Le mot de passe doit contenir au moins 12 caractères."]);
            exit;
        }
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password'])) {
            echo json_encode([
                "message" => "Connexion réussie",
                "user" => [
                    "id" => $user['id'], 
                    "username" => $user['username'],
                    "full_name" => $user['full_name'],
                    "service" => $user['service']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Identifiants invalides"]);
        }
    }
}
?>
