<?php
// Comunidad: personas visibles, publicaciones, talleres, Modo Foco y solicitudes de contacto.
// Solo para miembros (el invitado no usa Comunidad, decisión de la responsable 2026-11-03).
// Privacidad (D-59): en Modo Foco la persona no aparece en las listas para nadie más.
declare(strict_types=1);

function miembroActual(): array
{
    $usuario = usuarioActual();
    if ($usuario['rol'] === 'invitado') {
        throw new ErrorApi(403, 'La Comunidad es para miembros de Olegario.', 'invitado');
    }
    return $usuario;
}

function filaPersona(array $f): array
{
    return [
        'id' => $f['id'],
        'nombre' => $f['nombre'],
        'profesion' => $f['profesion'],
        'fotoUrl' => urlPublica($f['foto_url']),
        'sobreMi' => $f['sobre_mi'],
        'ofrezco' => $f['ofrezco'],
        'busco' => $f['busco'],
        'disponible' => (bool) $f['disponible'],
    ];
}

/** GET /comunidad — todo lo que muestra la pestaña Comunidad. */
function verComunidad(): never
{
    $usuario = miembroActual();
    $pdo = db();

    $consulta = $pdo->prepare('SELECT modo_comunidad FROM perfiles WHERE id = ?');
    $consulta->execute([$usuario['id']]);
    $modo = $consulta->fetchColumn();

    // Otras personas visibles: miembros (o equipo) en "Conexión abierta".
    $consulta = $pdo->prepare(
        "SELECT id, nombre, profesion, foto_url, sobre_mi, ofrezco, busco, disponible FROM perfiles
         WHERE id <> ? AND rol <> 'invitado' AND modo_comunidad = 'abierta' ORDER BY nombre"
    );
    $consulta->execute([$usuario['id']]);
    $personas = array_map('filaPersona', $consulta->fetchAll());

    $consulta = $pdo->prepare(
        'SELECT pu.*, pe.nombre AS autor_nombre, pe.profesion AS autor_profesion, pe.modo_comunidad AS autor_modo
         FROM publicaciones pu JOIN perfiles pe ON pe.id = pu.autor_id ORDER BY pu.creada_en DESC'
    );
    $consulta->execute();
    $publicaciones = array_map(fn (array $f) => [
        'id' => $f['id'],
        'tipo' => $f['tipo'],
        'busca' => $f['busca'],
        'titulo' => $f['titulo'],
        'descripcion' => $f['descripcion'],
        'etiquetas' => json_decode($f['etiquetas'], true) ?? [],
        // Si la persona autora está en Modo Foco, no se enlaza a su perfil.
        'autor' => [
            'id' => $f['autor_modo'] === 'abierta' || $f['autor_id'] === $usuario['id'] ? $f['autor_id'] : null,
            'nombre' => $f['autor_nombre'],
            'profesion' => $f['autor_profesion'],
        ],
        'esPropia' => $f['autor_id'] === $usuario['id'],
        'creadaEn' => aIso($f['creada_en']),
    ], $consulta->fetchAll());

    $talleres = $pdo->query('SELECT id, tipo, cuando, titulo, descripcion, accion FROM talleres ORDER BY id')->fetchAll();

    // Solicitudes que ya envié (para mostrar "Solicitud enviada"): el id de la persona, publicación o taller.
    $consulta = $pdo->prepare('SELECT COALESCE(para_perfil, publicacion_id, taller_id) AS destino FROM solicitudes WHERE de_id = ?');
    $consulta->execute([$usuario['id']]);

    responder([
        'modo' => $modo,
        'personas' => $personas,
        'publicaciones' => $publicaciones,
        'talleres' => $talleres,
        'solicitudesEnviadas' => array_values(array_unique($consulta->fetchAll(PDO::FETCH_COLUMN))),
    ]);
}

/** PATCH /comunidad/modo {modo: 'abierta' | 'foco'} */
function cambiarModoComunidad(): never
{
    $usuario = miembroActual();
    $modo = cuerpo()['modo'] ?? '';
    if (!in_array($modo, ['abierta', 'foco'], true)) {
        throw new ErrorApi(422, 'Elegí "Conexión abierta" o "Modo Foco".', 'campo_invalido');
    }
    db()->prepare('UPDATE perfiles SET modo_comunidad = ? WHERE id = ?')->execute([$modo, $usuario['id']]);
    responder(['modo' => $modo]);
}

/** POST /publicaciones {tipo, busca?, titulo, descripcion, etiquetas[]} — mismas reglas que la app. */
function publicar(): never
{
    $usuario = miembroActual();
    $datos = cuerpo();
    $tipo = $datos['tipo'] ?? '';
    if (!in_array($tipo, ['colaborador', 'iniciativa'], true)) {
        throw new ErrorApi(422, 'Elegí el tipo de publicación.', 'campo_invalido');
    }
    $busca = $tipo === 'colaborador' ? texto($datos, 'busca', 2, 50) : null;
    $titulo = texto($datos, 'titulo', 5, 80);
    $descripcion = texto($datos, 'descripcion', 20, 400);
    $etiquetas = array_values(array_filter(array_map(
        fn ($e) => mb_substr(trim((string) $e), 0, 30),
        is_array($datos['etiquetas'] ?? null) ? array_slice($datos['etiquetas'], 0, 8) : []
    ), fn ($e) => $e !== ''));

    $id = uuid();
    db()->prepare('INSERT INTO publicaciones (id, autor_id, tipo, busca, titulo, descripcion, etiquetas) VALUES (?, ?, ?, ?, ?, ?, ?)')
        ->execute([$id, $usuario['id'], $tipo, $busca, $titulo, $descripcion, json_encode($etiquetas, JSON_UNESCAPED_UNICODE)]);
    responder(['id' => $id], 201);
}

/** DELETE /publicaciones/{id} — solo la propia (o el equipo). */
function eliminarPublicacion(string $id): never
{
    $usuario = miembroActual();
    $consulta = db()->prepare('DELETE FROM publicaciones WHERE id = ? AND (autor_id = ? OR ? = \'equipo\')');
    $consulta->execute([$id, $usuario['id'], $usuario['rol']]);
    if ($consulta->rowCount() === 0) {
        throw new ErrorApi(404, 'No encontramos esa publicación.', 'no_existe');
    }
    responder(['ok' => true]);
}

/**
 * POST /solicitudes {destino, mensaje} — contactar a una persona, postularse a una publicación o
 * sumarse a un taller. `destino` es el id de cualquiera de los tres.
 */
function enviarSolicitud(): never
{
    $usuario = miembroActual();
    $datos = cuerpo();
    $destino = (string) ($datos['destino'] ?? '');
    $mensaje = texto($datos, 'mensaje', 0, 300);
    $pdo = db();

    $columna = null;
    $consulta = $pdo->prepare("SELECT 1 FROM perfiles WHERE id = ? AND id <> ? AND rol <> 'invitado' AND modo_comunidad = 'abierta'");
    $consulta->execute([$destino, $usuario['id']]);
    if ($consulta->fetchColumn()) {
        $columna = 'para_perfil';
    } else {
        $consulta = $pdo->prepare('SELECT autor_id FROM publicaciones WHERE id = ?');
        $consulta->execute([$destino]);
        $autor = $consulta->fetchColumn();
        if ($autor !== false && $autor !== $usuario['id']) {
            $columna = 'publicacion_id';
        } else {
            $consulta = $pdo->prepare('SELECT 1 FROM talleres WHERE id = ?');
            $consulta->execute([$destino]);
            if ($consulta->fetchColumn()) {
                $columna = 'taller_id';
            }
        }
    }
    if ($columna === null) {
        throw new ErrorApi(404, 'No encontramos a quién enviar la solicitud.', 'no_existe');
    }

    // Una sola solicitud por destino: si ya la envió, no se duplica.
    $consulta = $pdo->prepare("SELECT 1 FROM solicitudes WHERE de_id = ? AND {$columna} = ?");
    $consulta->execute([$usuario['id'], $destino]);
    if (!$consulta->fetchColumn()) {
        $pdo->prepare("INSERT INTO solicitudes (id, de_id, {$columna}, mensaje) VALUES (?, ?, ?, ?)")
            ->execute([uuid(), $usuario['id'], $destino, $mensaje]);
    }
    responder(['enviada' => true], 201);
}
