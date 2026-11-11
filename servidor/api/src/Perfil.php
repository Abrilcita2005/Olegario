<?php
// Servicios del Perfil de cuenta: membresía, paquetes en recepción, valoraciones y mensajes al equipo.
// Los pagos siguen SIMULADOS (decisión de la responsable): acá no hay datos de tarjetas ni facturas.
declare(strict_types=1);

/** GET /membresia — plan, acceso y vencimiento (null para el invitado). */
function verMembresia(): never
{
    $usuario = usuarioActual();
    $consulta = db()->prepare('SELECT plan, acceso, vence, renovacion_automatica FROM membresias WHERE usuario_id = ?');
    $consulta->execute([$usuario['id']]);
    $m = $consulta->fetch();
    responder($m ? [
        'plan' => $m['plan'],
        'acceso' => $m['acceso'],
        'vence' => $m['vence'],
        'renovacionAutomatica' => (bool) $m['renovacion_automatica'],
    ] : null);
}

/** GET /paquetes — mis paquetes sin retirar (los carga el equipo desde phpMyAdmin). */
function verPaquetes(): never
{
    $usuario = usuarioActual();
    $consulta = db()->prepare('SELECT id, descripcion, estado FROM paquetes WHERE usuario_id = ? AND NOT retirado ORDER BY id');
    $consulta->execute([$usuario['id']]);
    responder($consulta->fetchAll());
}

/** GET /opiniones — cuántas valoraciones y mensajes envié (para el texto "Ya enviaste…"). */
function verMisOpiniones(): never
{
    $usuario = usuarioActual();
    $consulta = db()->prepare(
        'SELECT (SELECT COUNT(*) FROM valoraciones WHERE usuario_id = ?) AS valoraciones,
                (SELECT COUNT(*) FROM mensajes_equipo WHERE usuario_id = ?) AS mensajes'
    );
    $consulta->execute([$usuario['id'], $usuario['id']]);
    $f = $consulta->fetch();
    responder(['valoraciones' => (int) $f['valoraciones'], 'mensajes' => (int) $f['mensajes']]);
}

/** POST /valoraciones {espacioId, estrellas, comentario} */
function valorarEspacio(): never
{
    $usuario = miembroActual();
    $datos = cuerpo();
    $estrellas = $datos['estrellas'] ?? null;
    if (!is_int($estrellas) || $estrellas < 1 || $estrellas > 5) {
        throw new ErrorApi(422, 'Elegí de 1 a 5 estrellas.', 'campo_invalido');
    }
    $comentario = texto($datos, 'comentario', 0, 300);
    $consulta = db()->prepare('SELECT 1 FROM espacios WHERE id = ?');
    $consulta->execute([(string) ($datos['espacioId'] ?? '')]);
    if (!$consulta->fetchColumn()) {
        throw new ErrorApi(404, 'Ese espacio no existe.', 'no_existe');
    }
    db()->prepare('INSERT INTO valoraciones (id, usuario_id, espacio_id, estrellas, comentario) VALUES (?, ?, ?, ?, ?)')
        ->execute([uuid(), $usuario['id'], $datos['espacioId'], $estrellas, $comentario]);
    responder(['ok' => true], 201);
}

/** POST /mensajes {tipo: 'queja' | 'sugerencia', texto} — libro de quejas y sugerencias. */
function enviarMensajeAlEquipo(): never
{
    $usuario = miembroActual();
    $datos = cuerpo();
    $tipo = $datos['tipo'] ?? '';
    if (!in_array($tipo, ['queja', 'sugerencia'], true)) {
        throw new ErrorApi(422, 'Elegí si es una queja o una sugerencia.', 'campo_invalido');
    }
    $texto = texto($datos, 'texto', 10, 600);
    db()->prepare('INSERT INTO mensajes_equipo (id, usuario_id, tipo, texto) VALUES (?, ?, ?, ?)')
        ->execute([uuid(), $usuario['id'], $tipo, $texto]);
    responder(['ok' => true], 201);
}
