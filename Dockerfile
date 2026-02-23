# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app/frontend
COPY taskflow-client/package*.json ./
RUN npm install
COPY taskflow-client/ ./
RUN npm run build

# Stage 2: Serve with PHP and Apache
FROM php:8.2-apache

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy the static frontend build
COPY --from=builder /app/frontend/out /var/www/html

# Copy the backend files correctly
# config.php goes to the root so scripts in /api can find it via ../config.php
COPY backend/config.php /var/www/html/
# The contents of backend/api/ go directly into /var/www/html/api/
COPY backend/api/ /var/www/html/api/

# Ensure uploads directory exists and is writable
RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads

# Update permissions for all files
RUN chown -R www-data:www-data /var/www/html

# Copy and prepare the startup script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port (Railway will map the PORT env var)
EXPOSE 80

# The startup script will configure port and MPM at runtime
CMD ["/usr/local/bin/start.sh"]
