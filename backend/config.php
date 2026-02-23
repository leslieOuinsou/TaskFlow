<?php
$host = '127.0.0.1';
$db   = 'taskflow';
$user = 'root'; // Change as needed
$pass = '';     // Change as needed
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    3 => 2, // ATTR_ERR_MODE => ERR_MODE_EXCEPTION
    19 => 2, // ATTR_DEFAULT_FETCH_MODE => FETCH_ASSOC
    20 => false, // ATTR_EMULATE_PREPARES => false
];

try {
     if (!extension_loaded('pdo_mysql')) {
         die(json_encode(["error" => "Extension pdo_mysql non disponible."]));
     }
     $pdo = new \PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(["error" => "Erreur de connexion DB : " . $e->getMessage()]);
     exit;
}
?>
