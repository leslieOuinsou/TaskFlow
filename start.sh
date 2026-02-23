#!/bin/bash

# Ensure we are using the PORT provided by Railway
if [ -z "$PORT" ]; then
  export PORT=80
fi

echo "Configuring Apache to listen on port $PORT..."
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:$PORT>/g" /etc/apache2/sites-available/000-default.conf

# Final check to disable conflicting MPMs
echo "Ensuring only mpm_prefork is loaded..."
# More aggressive cleaning
rm -f /etc/apache2/mods-enabled/mpm_*.load
rm -f /etc/apache2/mods-enabled/mpm_*.conf
ln -s ../mods-available/mpm_prefork.load /etc/apache2/mods-enabled/
ln -s ../mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/ || true
a2dismod mpm_event mpm_worker || true
a2enmod mpm_prefork || true

# Start Apache in the foreground
echo "Starting Apache..."
exec apache2-foreground
