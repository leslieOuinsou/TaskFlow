<?php
// Railway injecte ces variables automatiquement quand vous ajoutez un plugin MySQL.
// En local, les valeurs par défaut sont utilisées.
$host    = getenv('MYSQLHOST')     ?: '127.0.0.1';
$port    = getenv('MYSQLPORT')     ?: '3306';
$db      = getenv('MYSQLDATABASE') ?: 'taskflow';
$user    = getenv('MYSQLUSER')     ?: 'root';
$pass    = getenv('MYSQLPASSWORD') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    if (!extension_loaded('pdo_mysql')) {
        echo json_encode(["status" => "error", "message" => "Extension pdo_mysql non disponible."]);
        exit;
    }
    $pdo = new \PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Erreur de connexion DB", 
        "details" => $e->getMessage(),
        "host" => $host,
        "port" => $port,
        "db" => $db,
        "user" => $user
    ]);
    exit;
}
?>
