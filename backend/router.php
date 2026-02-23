<?php
// Router for php -S built-in server
// Ensures static files are served directly and PHP files are routed correctly

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// If a real file exists on disk, serve it directly (for uploads, etc.)
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Otherwise let PHP handle it (route to the correct .php file)
return false;
?>
