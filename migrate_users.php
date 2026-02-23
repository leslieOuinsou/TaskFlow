<?php
$host = '127.0.0.1';
$db   = 'taskflow';
$user = 'root';
$pass = '';

try {
    $pdo = new \PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(\PDO::ATTR_ERR_MODE, \PDO::ERR_MODE_EXCEPTION);

    // Check if columns exist
    $columns = $pdo->query("DESCRIBE users")->fetchAll(\PDO::FETCH_COLUMN);
    
    if (!in_array('full_name', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL AFTER id");
        echo "Added full_name column.\n";
    }
    
    if (!in_array('email', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL AFTER full_name");
        echo "Added email column.\n";
    }

    echo "Migration completed successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
