<?php
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $pdo = new \PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(3, 2); // ATTR_ERR_MODE, ERR_MODE_EXCEPTION
    
    // Create DB
    $pdo->exec("CREATE DATABASE IF NOT EXISTS taskflow");
    $pdo->exec("USE taskflow");

    // Create Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        comment TEXT,
        priority ENUM('Basse', 'Normale', 'Urgente') DEFAULT 'Normale',
        status ENUM('En attente', 'En cours', 'Terminé') DEFAULT 'En attente',
        service VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS task_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )");

    echo "Base de données initialisée avec succès standalone.\n";
} catch (\PDOException $e) {
    echo "ERREUR : " . $e->getMessage() . "\n";
}
?>
