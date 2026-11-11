<?php
// Eventos, inscripciones y contenido que carga el equipo (efemérides, novedades, talleres, beneficios).
declare(strict_types=1);

/** GET /eventos — eventos activos desde hoy, con la cantidad de inscriptos (sin decir quiénes). */
function listarEventos(): never
{
    $usuario = usuarioActual();
    $consulta = db()->prepare(
        'SELECT e.*, (SELECT COUNT(*) FROM inscripciones i WHERE i.evento_id = e.id) AS inscriptos,
                EXISTS (SELECT 1 FROM inscripciones i WHERE i.evento_id = e.id AND i.usuario_id = ?) AS inscripto
         FROM eventos e WHERE e.activo AND e.inicio >= ? ORDER BY e.inicio'
    );
    $consulta->execute([$usuario['id'], aMysql(inicioDelDiaMendoza(ahoraUtc()))]);
    responder(array_map(fn (array $f) => [
        'id' => $f['id'],
        'submarca' => $f['submarca'],
        'titulo' => $f['titulo'],
        'detalle' => $f['detalle'],
        // Descripción larga (04_descripcion_eventos.sql); null si la columna todavía no existe.
        'descripcion' => $f['descripcion'] ?? null,
        'inicio' => aIso($f['inicio']),
        'fotoUrl' => $f['foto_url'],
        'cupo' => $f['cupo'] === null ? null : (int) $f['cupo'],
        'inscriptos' => (int) $f['inscriptos'],
        'inscripto' => (bool) $f['inscripto'],
    ], $consulta->fetchAll()));
}

/** POST /eventos/{id}/inscripcion — también la usan Novedades (por ejemplo, el coworkeo itinerante). */
function inscribirme(string $eventoId): never
{
    $usuario = usuarioActual();
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $consulta = $pdo->prepare('SELECT cupo FROM eventos WHERE id = ? AND activo FOR UPDATE');
        $consulta->execute([$eventoId]);
        $evento = $consulta->fetch();
        if (!$evento) {
            throw new ErrorApi(404, 'Ese evento no existe.', 'no_existe');
        }
        if ($evento['cupo'] !== null) {
            $consulta = $pdo->prepare('SELECT COUNT(*) AS n FROM inscripciones WHERE evento_id = ? AND usuario_id <> ?');
            $consulta->execute([$eventoId, $usuario['id']]);
            if ((int) $consulta->fetch()['n'] >= (int) $evento['cupo']) {
                throw new ErrorApi(409, 'El evento ya no tiene cupos.', 'sin_cupo');
            }
        }
        // Si ya estaba inscripta, no pasa nada.
        $pdo->prepare('INSERT IGNORE INTO inscripciones (usuario_id, evento_id) VALUES (?, ?)')
            ->execute([$usuario['id'], $eventoId]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
    responder(['inscripto' => true]);
}

/** DELETE /eventos/{id}/inscripcion */
function darmeDeBaja(string $eventoId): never
{
    $usuario = usuarioActual();
    db()->prepare('DELETE FROM inscripciones WHERE usuario_id = ? AND evento_id = ?')
        ->execute([$usuario['id'], $eventoId]);
    responder(['inscripto' => false]);
}

/** GET /contenido — efemérides, novedades vigentes, talleres y beneficios. */
function verContenido(): never
{
    usuarioActual();
    $pdo = db();
    $hoy = inicioDelDiaMendoza(ahoraUtc())->format('Y-m-d');
    $novedades = $pdo->prepare(
        'SELECT id, titulo, texto, descuento, foto_url AS fotoUrl, accion, evento_id AS eventoId, orden
         FROM novedades WHERE vigente_hasta IS NULL OR vigente_hasta >= ? ORDER BY orden'
    );
    $novedades->execute([$hoy]);
    responder([
        'efemerides' => $pdo->query('SELECT id, mes, dia, titulo, texto, beneficio FROM efemerides ORDER BY mes, dia')->fetchAll(),
        'novedades' => $novedades->fetchAll(),
        'talleres' => $pdo->query('SELECT id, tipo, cuando, titulo, descripcion, accion FROM talleres ORDER BY id')->fetchAll(),
        'beneficios' => $pdo->query('SELECT id, titulo, detalle, lugar FROM beneficios ORDER BY id')->fetchAll(),
    ]);
}
