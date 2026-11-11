#!/usr/bin/env bash
# Arma el paquete para subir a Hostinger (hosting compartido, sin Docker, PHP 8.1 o más nuevo):
#   olegario.zip → se descomprime DENTRO de public_html y crea la carpeta olegario/ con todo:
#                  index.php, .htaccess, fotos/ y olegario-api/ (código y config.php, bloqueada para internet)
#   01…04_*.sql  → se importan en phpMyAdmin, en ese orden
# Uso: bash servidor/hostinger/armar_paquete.sh [carpeta de salida]
set -euo pipefail
cd "$(dirname "$0")/.."
SALIDA="${1:-hostinger/paquete}"
TEMPORAL="$(mktemp -d)"
trap 'rm -rf "$TEMPORAL"' EXIT

OLEGARIO="$TEMPORAL/olegario"
mkdir -p "$OLEGARIO/fotos" "$OLEGARIO/olegario-api"
cp api/public/index.php api/public/.htaccess "$OLEGARIO/"
cp -r api/src "$OLEGARIO/olegario-api/"
cp hostinger/config.ejemplo.php "$OLEGARIO/olegario-api/config.php"
# Las fotos de perfil de prueba no se suben; la carpeta va vacía (con un archivo para que exista).
echo "Acá se guardan las fotos de perfil." > "$OLEGARIO/fotos/LEEME.txt"
# Segunda barrera: aunque falle la regla del .htaccess principal, nadie puede ver el código ni la contraseña.
printf '<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n' > "$OLEGARIO/olegario-api/.htaccess"

mkdir -p "$SALIDA"
SALIDA="$(cd "$SALIDA" && pwd)"
rm -f "$SALIDA/olegario.zip"
(cd "$TEMPORAL" && zip -qr "$SALIDA/olegario.zip" olegario)
cp db/01_esquema.sql db/02_contenido_inicial.sql db/03_codigos_acceso.sql db/04_descripcion_eventos.sql "$SALIDA/"
echo "Listo en $SALIDA: olegario.zip y los 4 archivos .sql"
