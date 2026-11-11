<?php
// Herramientas comunes de la API: conexión a MySQL, respuestas JSON, errores y fechas.
declare(strict_types=1);

const ZONA_MENDOZA = 'America/Argentina/Mendoza';

// Error que se muestra a la persona (mensaje en español, sin detalles técnicos).
final class ErrorApi extends Exception
{
    public function __construct(public readonly int $estado, string $mensaje, public readonly string $codigo = 'error')
    {
        parent::__construct($mensaje);
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', getenv('DB_HOST') ?: 'db', getenv('DB_NAME') ?: 'olegario');
        $pdo = new PDO($dsn, getenv('DB_USER') ?: '', getenv('DB_PASSWORD') ?: '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}

function responder(mixed $datos, int $estado = 200): never
{
    http_response_code($estado);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Cuerpo JSON de la petición. */
function cuerpo(): array
{
    $texto = file_get_contents('php://input') ?: '';
    if ($texto === '') {
        return [];
    }
    $datos = json_decode($texto, true);
    if (!is_array($datos)) {
        throw new ErrorApi(400, 'Los datos enviados no son válidos.');
    }
    return $datos;
}

function texto(array $datos, string $campo, int $minimo, int $maximo): string
{
    $valor = trim((string) ($datos[$campo] ?? ''));
    $largo = mb_strlen($valor);
    if ($largo < $minimo || $largo > $maximo) {
        throw new ErrorApi(422, "Revisá el campo «{$campo}».", 'campo_invalido');
    }
    return $valor;
}

function uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// Fechas: la app manda y recibe ISO 8601 (con zona); la base guarda UTC.
function fechaDesdeIso(mixed $valor, string $campo): DateTimeImmutable
{
    if (!is_string($valor)) {
        throw new ErrorApi(422, "Falta la fecha «{$campo}».", 'campo_invalido');
    }
    try {
        return (new DateTimeImmutable($valor))->setTimezone(new DateTimeZone('UTC'));
    } catch (Exception) {
        throw new ErrorApi(422, "La fecha «{$campo}» no es válida.", 'campo_invalido');
    }
}

function aMysql(DateTimeImmutable $fecha): string
{
    return $fecha->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

function aIso(?string $mysql): ?string
{
    return $mysql === null ? null : (new DateTimeImmutable($mysql, new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s\Z');
}

/** Dirección completa de un archivo público de la API (por ejemplo, una foto de perfil). */
function urlPublica(?string $ruta): ?string
{
    if ($ruta === null || $ruta === '') {
        return null;
    }
    $esquema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    return "{$esquema}://{$host}/" . ltrim($ruta, '/');
}

/** Texto opcional: vacío → null. */
function textoOpcional(array $datos, string $campo, int $maximo): ?string
{
    if (!array_key_exists($campo, $datos) || $datos[$campo] === null) {
        return null;
    }
    $valor = texto($datos, $campo, 0, $maximo);
    return $valor === '' ? null : $valor;
}

function ahoraUtc(): DateTimeImmutable
{
    return new DateTimeImmutable('now', new DateTimeZone('UTC'));
}

/** Medianoche de hoy en Mendoza (los "días" de las reglas son días de Mendoza). */
function inicioDelDiaMendoza(DateTimeImmutable $fecha): DateTimeImmutable
{
    return $fecha->setTimezone(new DateTimeZone(ZONA_MENDOZA))->setTime(0, 0);
}
