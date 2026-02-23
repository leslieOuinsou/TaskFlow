<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

$upload_dir = __DIR__ . '/../../uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if ($method === 'GET') {
    $taskId = $_GET['task_id'] ?? null;
    if ($taskId) {
        $stmt = $pdo->prepare("SELECT * FROM attachments WHERE task_id = ? ORDER BY created_at DESC");
        $stmt->execute([$taskId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM attachments ORDER BY created_at DESC");
    }
    echo json_encode($stmt->fetchAll());
} elseif ($method === 'POST') {
    try {
        if (!isset($_FILES['file']) || !isset($_POST['task_id'])) {
            http_response_code(400);
            echo json_encode([
                "message" => "Données manquantes",
                "debug_files" => array_keys($_FILES),
                "debug_post"  => array_keys($_POST),
            ]);
            exit;
        }

        $taskId = $_POST['task_id'];
        $file   = $_FILES['file'];

        // Check for PHP upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $phpErrors = [
                UPLOAD_ERR_INI_SIZE   => 'Fichier dépasse upload_max_filesize (php.ini)',
                UPLOAD_ERR_FORM_SIZE  => 'Fichier dépasse MAX_FILE_SIZE du formulaire',
                UPLOAD_ERR_PARTIAL    => 'Upload partiel',
                UPLOAD_ERR_NO_FILE    => 'Aucun fichier envoyé',
                UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
                UPLOAD_ERR_CANT_WRITE => 'Échec écriture disque',
                UPLOAD_ERR_EXTENSION  => 'Extension PHP bloquée',
            ];
            http_response_code(500);
            echo json_encode(["message" => $phpErrors[$file['error']] ?? "Erreur upload PHP ({$file['error']})"]);
            exit;
        }

        $filename    = time() . '_' . basename($file['name']);
        $target_file = $upload_dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            $stmt = $pdo->prepare("INSERT INTO attachments (task_id, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $taskId,
                $file['name'],
                $filename,
                $file['size'],
                $file['type']
            ]);
            echo json_encode(["message" => "Fichier uploadé", "id" => $pdo->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode([
                "message"     => "move_uploaded_file a échoué",
                "tmp_name"    => $file['tmp_name'],
                "target"      => $target_file,
                "upload_dir"  => realpath($upload_dir),
                "dir_writable"=> is_writable($upload_dir),
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Exception: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID manquant"]);
        exit;
    }

    // Récupérer les infos du fichier pour le supprimer du disque
    $stmt = $pdo->prepare("SELECT file_path FROM attachments WHERE id = ?");
    $stmt->execute([$id]);
    $attachment = $stmt->fetch();

    if ($attachment) {
        $file_path = $upload_dir . $attachment['file_path'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }

        $stmt = $pdo->prepare("DELETE FROM attachments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Pièce jointe supprimée"]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Pièce jointe non trouvée"]);
    }
}
?>
