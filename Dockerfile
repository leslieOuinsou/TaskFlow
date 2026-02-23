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

# Copy the backend files to /api
COPY backend/ /var/www/html/api/

# Update permissions
RUN chown -R www-data:www-data /var/www/html

# Copy and prepare the startup script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port (Railway will map the PORT env var)
EXPOSE 80

# The startup script will configure port and MPM at runtime
CMD ["/usr/local/bin/start.sh"]
