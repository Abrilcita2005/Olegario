<?php
// API de Olegario en Movimiento (Etapa 13): recibe cada petición y la manda a la función que corresponde.
// La app se comunica solo con esta API; nunca directo con MySQL.
declare(strict_types=1);

// Con el servidor de prueba de PHP (php -S), los archivos que existen (fotos) se entregan tal cual,
// como hace Apache con el .htaccess.
if (PHP_SAPI === 'cli-server' && is_file(__DIR__ . (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/'))) {
    return false;
}

// Carpeta pública (esta): index.php, .htaccess y fotos/.
const CARPETA_PUBLICA = __DIR__;

// Carpeta privada (código y configuración), fuera del alcance de internet:
//  * En Hostinger: `olegario-api/`, al lado de `public_html/` (ver servidor/hostinger/GUIA.md).
//  * En Docker o en local: la carpeta de arriba (`servidor/api/`).
$carpetaPrivada = is_dir(__DIR__ . '/../../olegario-api/src') ? __DIR__ . '/../../olegario-api' : __DIR__ . '/..';

// Configuración del servidor (datos de la base). En Hostinger vive en olegario-api/config.php;
// en Docker no existe y se usan las variables de entorno.
$archivoConfig = $carpetaPrivada . '/config.php';
define('CONFIG_SERVIDOR', is_file($archivoConfig) ? (array) require $archivoConfig : []);

require $carpetaPrivada . '/src/Base.php';
require $carpetaPrivada . '/src/Cuentas.php';
require $carpetaPrivada . '/src/Reservas.php';
require $carpetaPrivada . '/src/Agenda.php';
require $carpetaPrivada . '/src/Comunidad.php';
require $carpetaPrivada . '/src/Perfil.php';

// Permite probar desde la versión web de la app (Expo en el navegador).
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
// Si la API vive en una subcarpeta (en Hostinger, /olegario), se le quita esa parte a la dirección.
if (RUTA_BASE !== '' && str_starts_with($ruta, RUTA_BASE)) {
    $ruta = substr($ruta, strlen(RUTA_BASE));
}
$ruta = rtrim($ruta, '/') ?: '/';

// [método, patrón de la dirección, función]. {id} es una parte variable de la dirección.
$rutas = [
    ['GET', '/salud', fn () => responder(['ok' => true, 'base' => (bool) db()->query('SELECT 1')->fetchColumn()])],
    ['POST', '/cuentas/registro', 'registrar'],
    ['POST', '/cuentas/ingreso', 'ingresar'],
    ['POST', '/cuentas/invitado', 'ingresarComoInvitado'],
    ['POST', '/cuentas/salir', 'salir'],
    ['GET', '/cuentas/yo', 'verMiCuenta'],
    ['PATCH', '/cuentas/yo', 'actualizarMiPerfil'],
    ['DELETE', '/cuentas/yo', 'eliminarMiCuenta'],
    ['PUT', '/cuentas/foto', 'cambiarMiFoto'],
    ['POST', '/cuentas/codigo', 'pedirCodigoDeAcceso'],
    ['POST', '/cuentas/canjear-codigo', 'canjearCodigoDeAcceso'],
    ['GET', '/espacios', 'listarEspacios'],
    ['GET', '/horas', 'verHoras'],
    ['POST', '/horas/extra', 'sumarHorasExtraSimuladas'],
    ['GET', '/reservas', 'listarMisReservas'],
    ['POST', '/reservas', 'crearReserva'],
    ['POST', '/reservas/{id}/cancelar', 'cancelarReserva'],
    ['GET', '/eventos', 'listarEventos'],
    ['POST', '/eventos/{id}/inscripcion', 'inscribirme'],
    ['DELETE', '/eventos/{id}/inscripcion', 'darmeDeBaja'],
    ['GET', '/contenido', 'verContenido'],
    ['GET', '/comunidad', 'verComunidad'],
    ['PATCH', '/comunidad/modo', 'cambiarModoComunidad'],
    ['POST', '/publicaciones', 'publicar'],
    ['DELETE', '/publicaciones/{id}', 'eliminarPublicacion'],
    ['POST', '/solicitudes', 'enviarSolicitud'],
    ['GET', '/membresia', 'verMembresia'],
    ['GET', '/paquetes', 'verPaquetes'],
    ['GET', '/opiniones', 'verMisOpiniones'],
    ['POST', '/valoraciones', 'valorarEspacio'],
    ['POST', '/mensajes', 'enviarMensajeAlEquipo'],
];

try {
    $existeRuta = false;
    foreach ($rutas as [$metodoRuta, $patron, $funcion]) {
        $regex = '#^' . preg_replace('#\{id\}#', '([A-Za-z0-9-]{1,60})', $patron) . '$#';
        if (!preg_match($regex, $ruta, $partes)) {
            continue;
        }
        $existeRuta = true;
        if ($metodoRuta === $metodo) {
            $funcion(...array_slice($partes, 1));
        }
    }
    throw $existeRuta ? new ErrorApi(405, 'Método no permitido.') : new ErrorApi(404, 'No existe esa dirección.');
} catch (ErrorApi $e) {
    responder(['error' => $e->getMessage(), 'codigo' => $e->codigo], $e->estado);
} catch (Throwable $e) {
    // El detalle técnico queda en el registro del servidor; a la persona solo un mensaje claro.
    error_log((string) $e);
    responder(['error' => 'No pudimos completar la operación. Probá de nuevo en unos minutos.', 'codigo' => 'servidor'], 500);
}
