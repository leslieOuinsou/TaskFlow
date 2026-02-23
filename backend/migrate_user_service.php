<?php
require_once 'config.php';

try {
    $pdo->exec("ALTER TABLE users ADD COLUMN service VARCHAR(100) AFTER username");
    echo "Colonne 'service' ajoutée à la table 'users' avec succès.\n";
} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}
?>
