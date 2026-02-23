# Stage 1: Build the frontend
FROM node:20-alpine AS builder
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

# Expose port (Railway will map the PORT env var)
EXPOSE 80

# Configure Apache for Railway and fix MPM conflict
RUN rm -f /etc/apache2/mods-enabled/mpm_event.load /etc/apache2/mods-enabled/mpm_event.conf \
    && rm -f /etc/apache2/mods-enabled/mpm_worker.load /etc/apache2/mods-enabled/mpm_worker.conf \
    && a2enmod mpm_prefork
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:${PORT}/g' /etc/apache2/sites-available/000-default.conf

# The default Apache entrypoint will start the server
