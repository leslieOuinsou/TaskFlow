# Stage 1: Build the frontend
FROM node:18-alpine AS builder
WORKDIR /app/frontend
COPY taskflow-client/package*.json ./
RUN npm install
COPY taskflow-client/ ./
RUN npm run build

# Stage 2: Serve with PHP and Apache
FROM php:8.3-apache

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

# Expose port 80 (Railway will map this)
EXPOSE 80

# The default Apache entrypoint will start the server
