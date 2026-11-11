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
            'SELECT p.id, p.rol, p.nombre, p.profesion, p.foto_url, p.sobre_mi, p.ofrezco, p.busco, u.correo FROM sesiones s
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
        'perfil' => $u['rol'] === 'invitado' ? null : [
            'nombre' => $u['nombre'],
            'profesion' => $u['profesion'],
            'correo' => $u['correo'] ?? '',
            'fotoUrl' => urlPublica($u['foto_url'] ?? null),
            'sobreMi' => $u['sobre_mi'] ?? null,
            'ofrezco' => $u['ofrezco'] ?? null,
            'busco' => $u['busco'] ?? null,
        ],
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
        'SELECT u.id, u.correo, u.contrasena_hash, p.rol, p.nombre, p.profesion, p.foto_url, p.sobre_mi, p.ofrezco, p.busco
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

// ───── Entrada directa al plano de reservas (olegario-reservas) ─────
const SEGUNDOS_CODIGO = 60;

/** POST /cuentas/codigo — código de un solo uso para abrir el plano con esta misma cuenta. */
function pedirCodigoDeAcceso(): never
{
    $usuario = usuarioActual();
    $codigo = bin2hex(random_bytes(16));
    $pdo = db();
    $pdo->exec('DELETE FROM codigos_acceso WHERE vence < UTC_TIMESTAMP()');
    $pdo->prepare('INSERT INTO codigos_acceso (codigo_hash, usuario_id, vence) VALUES (?, ?, ?)')
        ->execute([hash('sha256', $codigo), $usuario['id'], aMysql(ahoraUtc()->modify('+' . SEGUNDOS_CODIGO . ' seconds'))]);
    responder(['codigo' => $codigo, 'venceEnSegundos' => SEGUNDOS_CODIGO], 201);
}

/** POST /cuentas/canjear-codigo {codigo} — lo usa el plano: devuelve una sesión y el código deja de servir. */
function canjearCodigoDeAcceso(): never
{
    $codigo = strtolower(trim((string) (cuerpo()['codigo'] ?? '')));
    if (!preg_match('/^[a-f0-9]{32}$/', $codigo)) {
        throw new ErrorApi(401, 'El enlace venció. Volvé a abrir el plano desde la app.', 'codigo_invalido');
    }
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $consulta = $pdo->prepare('SELECT usuario_id FROM codigos_acceso WHERE codigo_hash = ? AND vence > UTC_TIMESTAMP() FOR UPDATE');
        $consulta->execute([hash('sha256', $codigo)]);
        $usuarioId = $consulta->fetchColumn();
        // Un solo uso: se borra aunque esté vencido.
        $pdo->prepare('DELETE FROM codigos_acceso WHERE codigo_hash = ?')->execute([hash('sha256', $codigo)]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
    if (!$usuarioId) {
        throw new ErrorApi(401, 'El enlace venció. Volvé a abrir el plano desde la app.', 'codigo_invalido');
    }
    $consulta = db()->prepare(
        'SELECT u.id, u.correo, p.rol, p.nombre, p.profesion, p.foto_url, p.sobre_mi, p.ofrezco, p.busco
         FROM usuarios u JOIN perfiles p ON p.id = u.id WHERE u.id = ?'
    );
    $consulta->execute([$usuarioId]);
    responder(['token' => abrirSesion($usuarioId), 'cuenta' => cuentaPublica($consulta->fetch())]);
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

/** PATCH /cuentas/yo {nombre, profesion, sobreMi?, ofrezco?, busco?} — lo que ve la Comunidad. */
function actualizarMiPerfil(): never
{
    $usuario = usuarioActual();
    $datos = cuerpo();
    $cambios = [
        'nombre' => texto($datos, 'nombre', 2, 60),
        'profesion' => texto($datos, 'profesion', 0, 80),
    ];
    // Los textos de la Comunidad solo cambian si llegan (vacío = se borra).
    foreach (['sobreMi' => ['sobre_mi', 600], 'ofrezco' => ['ofrezco', 300], 'busco' => ['busco', 300]] as $campo => [$columna, $maximo]) {
        if (array_key_exists($campo, $datos)) {
            $cambios[$columna] = textoOpcional($datos, $campo, $maximo);
        }
    }
    $columnas = implode(', ', array_map(fn ($c) => "{$c} = ?", array_keys($cambios)));
    db()->prepare("UPDATE perfiles SET {$columnas} WHERE id = ?")->execute([...array_values($cambios), $usuario['id']]);
    responder(cuentaPublica([...$usuario, ...$cambios]));
}

// Fotos de perfil: se guardan como archivo en public/fotos/ (con nombre al azar) y en la base solo
// queda la ruta. Solo JPG, PNG o WEBP de hasta 2 MB.
const CARPETA_FOTOS = CARPETA_PUBLICA . '/fotos';
const TIPOS_FOTO = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

function borrarArchivoDeFoto(?string $ruta): void
{
    if ($ruta && preg_match('#^fotos/[a-f0-9]{32}\.(jpg|png|webp)$#', $ruta)) {
        @unlink(CARPETA_PUBLICA . '/' . $ruta);
    }
}

/** PUT /cuentas/foto {foto: "data:image/jpeg;base64,..."} — o null para quitarla. */
function cambiarMiFoto(): never
{
    $usuario = usuarioActual();
    if ($usuario['rol'] === 'invitado') {
        throw new ErrorApi(403, 'La foto de perfil es para miembros.', 'invitado');
    }
    $foto = cuerpo()['foto'] ?? null;
    $ruta = null;
    if ($foto !== null) {
        if (!is_string($foto) || !preg_match('#^data:image/[a-z]+;base64,(.+)$#s', $foto, $m)) {
            throw new ErrorApi(422, 'La foto no es válida.', 'foto_invalida');
        }
        $bytes = base64_decode($m[1], true);
        if ($bytes === false || strlen($bytes) > 2 * 1024 * 1024) {
            throw new ErrorApi(422, 'La foto es demasiado grande (máximo 2 MB).', 'foto_invalida');
        }
        // El tipo se comprueba mirando el archivo, no lo que dice la app.
        $tipo = (new finfo(FILEINFO_MIME_TYPE))->buffer($bytes);
        if (!isset(TIPOS_FOTO[$tipo])) {
            throw new ErrorApi(422, 'La foto tiene que ser JPG, PNG o WEBP.', 'foto_invalida');
        }
        if (!is_dir(CARPETA_FOTOS) && !mkdir(CARPETA_FOTOS, 0755, true)) {
            throw new RuntimeException('No se pudo crear la carpeta de fotos.');
        }
        $ruta = 'fotos/' . bin2hex(random_bytes(16)) . '.' . TIPOS_FOTO[$tipo];
        if (file_put_contents(CARPETA_PUBLICA . '/' . $ruta, $bytes) === false) {
            throw new RuntimeException('No se pudo guardar la foto.');
        }
    }
    borrarArchivoDeFoto($usuario['foto_url']);
    db()->prepare('UPDATE perfiles SET foto_url = ? WHERE id = ?')->execute([$ruta, $usuario['id']]);
    responder(['fotoUrl' => urlPublica($ruta)]);
}

// Eliminar cuenta (obligatorio en App Store): borra el usuario y, en cascada, todos sus datos.
function eliminarMiCuenta(): never
{
    $usuario = usuarioActual();
    borrarArchivoDeFoto($usuario['foto_url']);
    db()->prepare('DELETE FROM usuarios WHERE id = ?')->execute([$usuario['id']]);
    responder(['ok' => true]);
}
