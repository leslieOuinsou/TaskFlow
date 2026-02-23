<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

$taskId = $_GET['task_id'] ?? null;
$upload_dir = '../../uploads/';

// Pour le bien de la démo, si taskId est 0, on prend tout (comme dans attachments.php)
if ($taskId === '0' || !$taskId) {
    $stmt = $pdo->query("SELECT file_name, file_path FROM attachments");
} else {
    $stmt = $pdo->prepare("SELECT file_name, file_path FROM attachments WHERE task_id = ?");
    $stmt->execute([$taskId]);
}

$attachments = $stmt->fetchAll();

if (empty($attachments)) {
    http_response_code(404);
    echo json_encode(["message" => "Aucun fichier à exporter"]);
    exit;
}

$zip = new ZipArchive();
$zip_name = "export_task_" . ($taskId ?: 'all') . "_" . time() . ".zip";
$zip_path = sys_get_temp_dir() . '/' . $zip_name;

if ($zip->open($zip_path, ZipArchive::CREATE) !== TRUE) {
    http_response_code(500);
    echo json_encode(["message" => "Impossible de créer le fichier ZIP"]);
    exit;
}

foreach ($attachments as $file) {
    $full_path = $upload_dir . $file['file_path'];
    if (file_exists($full_path)) {
        $zip->addFile($full_path, $file['file_name']);
    }
}

$zip->close();

if (file_exists($zip_path)) {
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $zip_name . '"');
    header('Content-Length: ' . filesize($zip_path));
    readfile($zip_path);
    unlink($zip_path); // Supprimer après envoi
    exit;
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la génération du ZIP"]);
}
?>
