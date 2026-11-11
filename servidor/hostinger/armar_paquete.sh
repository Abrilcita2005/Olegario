#!/usr/bin/env bash
# Arma los dos .zip para subir a Hostinger (hosting compartido, sin Docker):
#   olegario-publico.zip → se descomprime DENTRO de public_html (crea la carpeta olegario/)
#   olegario-api.zip     → se descomprime AL LADO de public_html (crea la carpeta olegario-api/)
#   01…04_*.sql          → se importan en phpMyAdmin, en ese orden
# Uso: bash servidor/hostinger/armar_paquete.sh [carpeta de salida]
set -euo pipefail
cd "$(dirname "$0")/.."
SALIDA="${1:-hostinger/paquete}"
TEMPORAL="$(mktemp -d)"
trap 'rm -rf "$TEMPORAL"' EXIT

mkdir -p "$TEMPORAL/publico/olegario/fotos" "$TEMPORAL/api/olegario-api"
cp api/public/index.php api/public/.htaccess "$TEMPORAL/publico/olegario/"
cp -r api/src "$TEMPORAL/api/olegario-api/"
cp hostinger/config.ejemplo.php "$TEMPORAL/api/olegario-api/config.php"
# Las fotos de perfil de prueba no se suben; la carpeta va vacía (con un archivo para que exista).
echo "Acá se guardan las fotos de perfil." > "$TEMPORAL/publico/olegario/fotos/LEEME.txt"
# Nadie puede ver el código ni la configuración aunque la carpeta quedara accesible por error.
printf '<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n' > "$TEMPORAL/api/olegario-api/.htaccess"

mkdir -p "$SALIDA"
SALIDA="$(cd "$SALIDA" && pwd)"
rm -f "$SALIDA/olegario-publico.zip" "$SALIDA/olegario-api.zip"
(cd "$TEMPORAL/publico" && zip -qr "$SALIDA/olegario-publico.zip" olegario)
(cd "$TEMPORAL/api" && zip -qr "$SALIDA/olegario-api.zip" olegario-api)
# Los archivos de la base, para importarlos en el phpMyAdmin de Hostinger (en este orden).
cp db/01_esquema.sql db/02_contenido_inicial.sql db/03_codigos_acceso.sql db/04_descripcion_eventos.sql "$SALIDA/"
echo "Listo en $SALIDA: olegario-publico.zip, olegario-api.zip y los 4 archivos .sql"
