<?php
require_once 'config.php';

try {
    // Add archived_at to tasks
    $pdo->exec("ALTER TABLE tasks ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL");
    
    // Create attachments table
    $pdo->exec("CREATE TABLE IF NOT EXISTS attachments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )");
    
    echo "Migration avancée réussie : colonnes d'archivage et table des pièces jointes ajoutées.\n";
} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
?>
