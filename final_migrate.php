<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=taskflow", "root", "");
    $pdo->setAttribute(3, 2); // ATTR_ERR_MODE, ERR_MODE_EXCEPTION
    
    // Check columns manually to avoid PDO constants if they fail in shell
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(fetch_style: 7); // 7 is FETCH_COLUMN
    
    if (!in_array('full_name', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL AFTER id");
        echo "full_name added. ";
    }
    if (!in_array('email', $columns)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL AFTER full_name");
        echo "email added. ";
    }
    echo "Done migration.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
