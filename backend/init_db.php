<?php
require_once 'config.php';

try {
    // Create Users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) DEFAULT '',
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        service VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Ensure missing columns exist (for existing tables)
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) DEFAULT '' AFTER id");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE NOT NULL AFTER full_name");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS service VARCHAR(50) DEFAULT '' AFTER password");

    // Ensure user_id exists in tasks
    $pdo->exec("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INT DEFAULT NULL AFTER id");

    // Create Task History table
    $pdo->exec("CREATE TABLE IF NOT EXISTS task_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )");

    // Create Attachments table
    $pdo->exec("CREATE TABLE IF NOT EXISTS attachments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INT NOT NULL DEFAULT 0,
        file_type VARCHAR(100) NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )");

    // Create Notifications table
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        task_id INT DEFAULT NULL,
        message VARCHAR(500) NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )");

    echo "Base de données initialisée avec succès.\n";
} catch (PDOException $e) {
    echo "Erreur lors de l'initialisation : " . $e->getMessage() . "\n";
}
?>

