# API de Olegario: PHP 8.3 con Apache y la extensión para MySQL (PDO).
FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql && a2enmod rewrite

# Apache sirve solo la carpeta public/; el resto del código no queda accesible desde afuera.
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
  && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

COPY . /var/www/html
