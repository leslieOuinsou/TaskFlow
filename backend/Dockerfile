FROM php:8.3-cli

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Expose the port Railway provides
EXPOSE ${PORT:-8080}

# Start PHP built-in server
CMD php -S 0.0.0.0:${PORT:-8080} -t /app router.php
