<?php
// Cuentas y sesiones: registro, ingreso, Modo invitado, salir, perfil y eliminar cuenta.
// La contraseña se guarda cifrada (password_hash); el token de sesión solo como huella (SHA-256).
declare(strict_types=1);

const DIAS_SESION = 30;
const LARGO_MINIMO_CONTRASENA = 8;

/** Crea una sesión y devuelve el token (se muestra una sola vez; la app lo guarda cifrado). */
function abrirSesion(string $usuarioId): string
{
    $token = bin2hex(random_bytes(32));
    db()->prepare('INSERT INTO sesiones (token_hash, usuario_id, vence) VALUES (?, ?, ?)')
        ->execute([hash('sha256', $token), $usuarioId, aMysql(ahoraUtc()->modify('+' . DIAS_SESION . ' days'))]);
    return $token;
}

function tokenDeLaPeticion(): ?string
{
    $encabezado = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    return preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $encabezado, $m) ? strtolower($m[1]) : null;
}

/** Persona con sesión (id, rol, nombre, profesión, correo). Si no hay sesión válida: error 401. */
function usuarioActual(): array
{
    $token = tokenDeLaPeticion();
    if ($token !== null) {
        $consulta = db()->prepare(
            'SELECT p.id, p.rol, p.nombre, p.profesion, u.correo FROM sesiones s
             JOIN usuarios u ON u.id = s.usuario_id JOIN perfiles p ON p.id = u.id
             WHERE s.token_hash = ? AND s.vence > UTC_TIMESTAMP()'
        );
        $consulta->execute([hash('sha256', $token)]);
        $usuario = $consulta->fetch();
        if ($usuario) {
            return $usuario;
        }
    }
    throw new ErrorApi(401, 'Tu sesión venció. Volvé a ingresar.', 'sin_sesion');
}

function cuentaPublica(array $u): array
{
    return [
        'id' => $u['id'],
        'tipoAcceso' => $u['rol'] === 'invitado' ? 'invitado' : 'miembro',
        'perfil' => $u['rol'] === 'invitado' ? null
            : ['nombre' => $u['nombre'], 'profesion' => $u['profesion'], 'correo' => $u['correo'] ?? ''],
    ];
}

function validarCorreo(array $datos): string
{
    $correo = mb_strtolower(trim((string) ($datos['correo'] ?? '')));
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || mb_strlen($correo) > 254) {
        throw new ErrorApi(422, 'Revisá el correo.', 'campo_invalido');
    }
    return $correo;
}

function registrar(): never
{
    $datos = cuerpo();
    $nombre = texto($datos, 'nombre', 2, 60);
    $profesion = texto($datos, 'profesion', 0, 80);
    $correo = validarCorreo($datos);
    $contrasena = (string) ($datos['contrasena'] ?? '');
    // Misma regla que la app (src/utils/validaciones.ts: LARGO_MINIMO_CONTRASENA).
    if (mb_strlen($contrasena) < LARGO_MINIMO_CONTRASENA || strlen($contrasena) > 72) {
        throw new ErrorApi(422, 'La contraseña necesita al menos ' . LARGO_MINIMO_CONTRASENA . ' caracteres.', 'contrasena_debil');
    }

    $pdo = db();
    $pdo->beginTransaction();
    try {
        $id = uuid();
        $pdo->prepare('INSERT INTO usuarios (id, correo, contrasena_hash) VALUES (?, ?, ?)')
            ->execute([$id, $correo, password_hash($contrasena, PASSWORD_DEFAULT)]);
        $pdo->prepare('INSERT INTO perfiles (id, nombre, profesion, rol) VALUES (?, ?, ?, ?)')
            ->execute([$id, $nombre, $profesion, 'miembro']);
        // Membresía con el plan por defecto (la ajusta el equipo desde phpMyAdmin).
        $vence = ahoraUtc()->setTimezone(new DateTimeZone(ZONA_MENDOZA))->modify('last day of this month')->format('Y-m-d');
        $pdo->prepare('INSERT INTO membresias (usuario_id, vence) VALUES (?, ?)')->execute([$id, $vence]);
        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        if ($e->getCode() === '23000') {
            throw new ErrorApi(409, 'Ya existe una cuenta con ese correo. Probá iniciar sesión.', 'correo_repetido');
        }
        throw $e;
    }
    responder(['token' => abrirSesion($id), 'cuenta' => cuentaPublica(['id' => $id, 'rol' => 'miembro',
        'nombre' => $nombre, 'profesion' => $profesion, 'correo' => $correo])], 201);
}

function ingresar(): never
{
    $datos = cuerpo();
    $correo = mb_strtolower(trim((string) ($datos['correo'] ?? '')));
    $consulta = db()->prepare(
        'SELECT u.id, u.correo, u.contrasena_hash, p.rol, p.nombre, p.profesion
         FROM usuarios u JOIN perfiles p ON p.id = u.id WHERE u.correo = ?'
    );
    $consulta->execute([$correo]);
    $usuario = $consulta->fetch();
    if (!$usuario || !password_verify((string) ($datos['contrasena'] ?? ''), (string) $usuario['contrasena_hash'])) {
        throw new ErrorApi(401, 'Correo o contraseña incorrectos.', 'credenciales');
    }
    responder(['token' => abrirSesion($usuario['id']), 'cuenta' => cuentaPublica($usuario)]);
}

// Modo invitado (D-34): cuenta sin correo con rol invitado; puede mirar e inscribirse a eventos.
function ingresarComoInvitado(): never
{
    $pdo = db();
    $id = uuid();
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO usuarios (id, es_invitado) VALUES (?, TRUE)')->execute([$id]);
    $pdo->prepare("INSERT INTO perfiles (id, nombre, rol) VALUES (?, 'Invitado', 'invitado')")->execute([$id]);
    $pdo->commit();
    responder(['token' => abrirSesion($id), 'cuenta' => cuentaPublica(['id' => $id, 'rol' => 'invitado',
        'nombre' => 'Invitado', 'profesion' => '', 'correo' => null])], 201);
}

function salir(): never
{
    $token = tokenDeLaPeticion();
    if ($token !== null) {
        db()->prepare('DELETE FROM sesiones WHERE token_hash = ?')->execute([hash('sha256', $token)]);
    }
    responder(['ok' => true]);
}

function verMiCuenta(): never
{
    responder(cuentaPublica(usuarioActual()));
}

function actualizarMiPerfil(): never
{
    $usuario = usuarioActual();
    $datos = cuerpo();
    $nombre = texto($datos, 'nombre', 2, 60);
    $profesion = texto($datos, 'profesion', 0, 80);
    db()->prepare('UPDATE perfiles SET nombre = ?, profesion = ? WHERE id = ?')
        ->execute([$nombre, $profesion, $usuario['id']]);
    responder(cuentaPublica([...$usuario, 'nombre' => $nombre, 'profesion' => $profesion]));
}

// Eliminar cuenta (obligatorio en App Store): borra el usuario y, en cascada, todos sus datos.
function eliminarMiCuenta(): never
{
    $usuario = usuarioActual();
    db()->prepare('DELETE FROM usuarios WHERE id = ?')->execute([$usuario['id']]);
    responder(['ok' => true]);
}
