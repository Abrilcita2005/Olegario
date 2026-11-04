<?php
// Espacios, reservas y horas del plan. Reglas de la responsable (2026-11-04): horario libre las 24 hs en
// pasos de 30 min, hasta 3 días de anticipación, con lugar libre, con horas suficientes y cancelación
// hasta 30 min antes. Se controlan acá, dentro de una transacción (aunque la app ya las controle).
declare(strict_types=1);

const DIAS_ANTICIPACION = 3;
const MINUTOS_LIMITE_CANCELACION = 30;

function filaEspacio(array $f): array
{
    return [
        'id' => $f['id'],
        'servicio' => $f['servicio'],
        'nombre' => $f['nombre'],
        'tipo' => $f['tipo'],
        'ubicacion' => $f['ubicacion'],
        'ambiente' => json_decode($f['ambiente'], true) ?? [],
        'equipamiento' => json_decode($f['equipamiento'], true) ?? [],
        'etiqueta' => $f['etiqueta'],
        'fotoUrl' => $f['foto_url'],
        'capacidad' => (int) $f['capacidad'],
    ];
}

function filaReserva(array $f): array
{
    return [
        'id' => $f['id'],
        'espacioId' => $f['espacio_id'],
        'inicio' => aIso($f['inicio']),
        'fin' => aIso($f['fin']),
        'cancelada' => (bool) $f['cancelada'],
    ];
}

/**
 * GET /espacios?desde=ISO&hasta=ISO — espacios activos con su ocupación en ese rango, SIN las reservas
 * de la persona (la app las suma aparte) y sin decir quién reservó.
 */
function listarEspacios(): never
{
    $usuario = usuarioActual();
    $desde = fechaDesdeIso($_GET['desde'] ?? null, 'desde');
    $hasta = fechaDesdeIso($_GET['hasta'] ?? null, 'hasta');

    $espacios = array_map('filaEspacio', db()->query('SELECT * FROM espacios WHERE activo ORDER BY id')->fetchAll());
    $consulta = db()->prepare(
        'SELECT espacio_id, inicio, fin FROM reservas
         WHERE NOT cancelada AND usuario_id <> ? AND inicio < ? AND ? < fin'
    );
    $consulta->execute([$usuario['id'], aMysql($hasta), aMysql($desde)]);
    $ocupacion = [];
    foreach ($consulta->fetchAll() as $o) {
        $ocupacion[$o['espacio_id']][] = ['inicio' => aIso($o['inicio']), 'fin' => aIso($o['fin'])];
    }
    foreach ($espacios as &$espacio) {
        $espacio['ocupaciones'] = $ocupacion[$espacio['id']] ?? [];
    }
    responder($espacios);
}

/** Horas: mensuales + extras − reservas no canceladas del mes en curso (mes de Mendoza). */
function horasDelPlan(string $usuarioId): ?array
{
    $consulta = db()->prepare('SELECT horas_mensuales + horas_extra AS total FROM membresias WHERE usuario_id = ?');
    $consulta->execute([$usuarioId]);
    $membresia = $consulta->fetch();
    if (!$membresia) {
        return null; // Invitado: sin membresía.
    }
    $inicioMes = inicioDelDiaMendoza(ahoraUtc())->modify('first day of this month');
    $consulta = db()->prepare(
        'SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, inicio, fin)), 0) / 60 AS usadas FROM reservas
         WHERE usuario_id = ? AND NOT cancelada AND inicio >= ?'
    );
    $consulta->execute([$usuarioId, aMysql($inicioMes)]);
    $total = (float) $membresia['total'];
    $usadas = (float) $consulta->fetch()['usadas'];
    return ['totales' => $total, 'usadas' => $usadas, 'disponibles' => max(0, $total - $usadas)];
}

/** GET /horas */
function verHoras(): never
{
    responder(horasDelPlan(usuarioActual()['id']));
}

/** GET /reservas — mis reservas no canceladas desde el inicio del mes. */
function listarMisReservas(): never
{
    $usuario = usuarioActual();
    $inicioMes = inicioDelDiaMendoza(ahoraUtc())->modify('first day of this month');
    $consulta = db()->prepare(
        'SELECT * FROM reservas WHERE usuario_id = ? AND NOT cancelada AND inicio >= ? ORDER BY inicio'
    );
    $consulta->execute([$usuario['id'], aMysql($inicioMes)]);
    responder(array_map('filaReserva', $consulta->fetchAll()));
}

/** POST /reservas {espacioId, inicio, fin} */
function crearReserva(): never
{
    $usuario = usuarioActual();
    if ($usuario['rol'] === 'invitado') {
        throw new ErrorApi(403, 'Para reservar necesitás una cuenta de miembro.', 'invitado');
    }
    $datos = cuerpo();
    $espacioId = (string) ($datos['espacioId'] ?? '');
    $inicio = fechaDesdeIso($datos['inicio'] ?? null, 'inicio');
    $fin = fechaDesdeIso($datos['fin'] ?? null, 'fin');
    $ahora = ahoraUtc();

    if ($fin <= $inicio) {
        throw new ErrorApi(422, 'El horario de fin tiene que ser posterior al de inicio.', 'duracion');
    }
    foreach ([$inicio, $fin] as $fecha) {
        if ($fecha->getTimestamp() % 1800 !== 0) {
            throw new ErrorApi(422, 'Los horarios van en pasos de 30 minutos.', 'duracion');
        }
    }
    if ($inicio < $ahora) {
        throw new ErrorApi(422, 'Elegí un horario que todavía no haya empezado.', 'pasado');
    }
    if ($inicio >= inicioDelDiaMendoza($ahora)->modify('+' . (DIAS_ANTICIPACION + 1) . ' days')) {
        throw new ErrorApi(422, 'Podés reservar con hasta ' . DIAS_ANTICIPACION . ' días de anticipación.', 'anticipacion');
    }

    $pdo = db();
    $pdo->beginTransaction();
    try {
        // Bloquea el espacio: dos reservas al mismo tiempo no pueden quedarse con el mismo lugar.
        $consulta = $pdo->prepare('SELECT capacidad FROM espacios WHERE id = ? AND activo FOR UPDATE');
        $consulta->execute([$espacioId]);
        $espacio = $consulta->fetch();
        if (!$espacio) {
            throw new ErrorApi(404, 'Ese espacio no existe.', 'no_existe');
        }
        $consulta = $pdo->prepare(
            'SELECT COUNT(*) AS ocupados FROM reservas WHERE espacio_id = ? AND NOT cancelada AND inicio < ? AND ? < fin'
        );
        $consulta->execute([$espacioId, aMysql($fin), aMysql($inicio)]);
        if ((int) $consulta->fetch()['ocupados'] >= (int) $espacio['capacidad']) {
            throw new ErrorApi(409, 'Ese espacio ya no tiene lugar en el horario elegido.', 'sinLugar');
        }
        $horas = horasDelPlan($usuario['id']);
        $duracion = ($fin->getTimestamp() - $inicio->getTimestamp()) / 3600;
        if ($horas === null || $duracion > $horas['disponibles']) {
            throw new ErrorApi(422, 'No te alcanzan las horas disponibles de tu plan.', 'horasInsuficientes');
        }
        $id = uuid();
        $pdo->prepare('INSERT INTO reservas (id, usuario_id, espacio_id, inicio, fin) VALUES (?, ?, ?, ?, ?)')
            ->execute([$id, $usuario['id'], $espacioId, aMysql($inicio), aMysql($fin)]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
    responder(['id' => $id, 'espacioId' => $espacioId, 'inicio' => aIso(aMysql($inicio)),
        'fin' => aIso(aMysql($fin)), 'cancelada' => false], 201);
}

/** POST /reservas/{id}/cancelar */
function cancelarReserva(string $id): never
{
    $usuario = usuarioActual();
    $consulta = db()->prepare('SELECT * FROM reservas WHERE id = ? AND usuario_id = ? AND NOT cancelada');
    $consulta->execute([$id, $usuario['id']]);
    $reserva = $consulta->fetch();
    if (!$reserva) {
        throw new ErrorApi(404, 'No encontramos esa reserva.', 'no_existe');
    }
    $limite = ahoraUtc()->modify('+' . MINUTOS_LIMITE_CANCELACION . ' minutes');
    if (new DateTimeImmutable($reserva['inicio'], new DateTimeZone('UTC')) < $limite) {
        throw new ErrorApi(422, 'Las reservas se cancelan hasta ' . MINUTOS_LIMITE_CANCELACION . ' minutos antes.', 'fuera_de_plazo');
    }
    db()->prepare('UPDATE reservas SET cancelada = TRUE WHERE id = ?')->execute([$id]);
    responder(['ok' => true]);
}
