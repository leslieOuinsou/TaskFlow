<?php
$c = mysqli_connect('127.0.0.1', 'root', '', 'taskflow');
if (!$c) die("Conn fail: " . mysqli_connect_error());

$res = mysqli_query($c, "SHOW COLUMNS FROM users LIKE 'full_name'");
if (mysqli_num_rows($res) == 0) {
    mysqli_query($c, "ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NOT NULL AFTER id");
    echo "full_name added. ";
}

$res = mysqli_query($c, "SHOW COLUMNS FROM users LIKE 'email'");
if (mysqli_num_rows($res) == 0) {
    mysqli_query($c, "ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL AFTER full_name");
    echo "email added. ";
}
echo "Done.";
mysqli_close($c);
?>
