<?php
// Pruebas de la API de punta a punta (cuentas, privacidad, reservas, agenda).
// Uso:  php servidor/pruebas/probar_api.php http://localhost:8080
// IMPORTANTE: crea cuentas y reservas de prueba. Usalo solo en una base local, nunca con datos reales.
declare(strict_types=1);

$base = rtrim($argv[1] ?? 'http://localhost:8080', '/');
$fallas = 0;
$total = 0;

function pedir(string $metodo, string $ruta, ?array $datos = null, ?string $token = null): array
{
    global $base;
    $encabezados = ['Content-Type: application/json'];
    if ($token) {
        $encabezados[] = "Authorization: Bearer {$token}";
    }
    $contexto = stream_context_create(['http' => [
        'method' => $metodo,
        'header' => implode("\r\n", $encabezados),
        'content' => $datos === null ? '' : json_encode($datos),
        'ignore_errors' => true,
    ]]);
    $respuesta = file_get_contents($base . $ruta, false, $contexto);
    preg_match('#HTTP/\S+ (\d+)#', $http_response_header[0] ?? '', $m);
    return [(int) ($m[1] ?? 0), json_decode((string) $respuesta, true)];
}

function comprobar(string $descripcion, bool $condicion, mixed $detalle = null): void
{
    global $fallas, $total;
    $total++;
    if (!$condicion) {
        $fallas++;
    }
    echo ($condicion ? '  ✓ ' : '  ✗ ') . $descripcion . ($condicion ? '' : ' → ' . json_encode($detalle, JSON_UNESCAPED_UNICODE)) . "\n";
}

// Primer horario de 30 min (en UTC) a partir de dentro de `horas`.
function horario(float $horas, float $duracion = 1): array
{
    $inicio = (int) (ceil((time() + $horas * 3600) / 1800) * 1800);
    return [gmdate('Y-m-d\TH:i:s\Z', $inicio), gmdate('Y-m-d\TH:i:s\Z', $inicio + (int) ($duracion * 3600))];
}

$correo = 'prueba+' . bin2hex(random_bytes(4)) . '@ejemplo.com';

echo "Salud\n";
[$e, $r] = pedir('GET', '/salud');
comprobar('la API y la base responden', $e === 200 && ($r['base'] ?? false) === true, $r);

echo "Cuentas\n";
[$e, $r] = pedir('POST', '/cuentas/registro', ['nombre' => 'Ana Prueba', 'profesion' => 'Diseño', 'correo' => $correo, 'contrasena' => 'clave-segura-1']);
comprobar('registro crea la cuenta y la sesión', $e === 201 && isset($r['token']), $r);
$ana = $r['token'] ?? '';
[$e] = pedir('POST', '/cuentas/registro', ['nombre' => 'Ana', 'profesion' => '', 'correo' => $correo, 'contrasena' => 'clave-segura-1']);
comprobar('no permite dos cuentas con el mismo correo', $e === 409);
[$e] = pedir('POST', '/cuentas/registro', ['nombre' => 'Ana', 'profesion' => '', 'correo' => 'otra' . $correo, 'contrasena' => 'corta']);
comprobar('rechaza contraseñas cortas', $e === 422);
[$e, $r] = pedir('POST', '/cuentas/ingreso', ['correo' => strtoupper($correo), 'contrasena' => 'mal']);
comprobar('contraseña incorrecta → 401 con mensaje claro', $e === 401 && $r['error'] === 'Correo o contraseña incorrectos.', $r);
[$e, $r] = pedir('POST', '/cuentas/ingreso', ['correo' => $correo, 'contrasena' => 'clave-segura-1']);
comprobar('ingreso con correo y contraseña', $e === 200 && $r['cuenta']['perfil']['nombre'] === 'Ana Prueba', $r);
[$e, $r] = pedir('PATCH', '/cuentas/yo', ['nombre' => 'Ana María', 'profesion' => 'UX'], $ana);
comprobar('edita el perfil', $e === 200 && $r['perfil']['nombre'] === 'Ana María', $r);
[$e] = pedir('GET', '/cuentas/yo');
comprobar('sin token → 401', $e === 401);
[$e] = pedir('GET', '/cuentas/yo', null, str_repeat('a', 64));
comprobar('token inventado → 401', $e === 401);

[$e, $r] = pedir('POST', '/cuentas/invitado');
comprobar('Modo invitado', $e === 201 && $r['cuenta']['tipoAcceso'] === 'invitado', $r);
$invitado = $r['token'] ?? '';

$correoBeto = 'prueba+' . bin2hex(random_bytes(4)) . '@ejemplo.com';
[, $r] = pedir('POST', '/cuentas/registro', ['nombre' => 'Beto Prueba', 'profesion' => '', 'correo' => $correoBeto, 'contrasena' => 'clave-segura-2']);
$beto = $r['token'] ?? '';

echo "Reservas\n";
[$e, $r] = pedir('GET', '/horas', null, $ana);
comprobar('horas del plan: 80 disponibles', $e === 200 && $r['disponibles'] == 80, $r);
[$i, $f] = horario(2, 2);
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'sala-acustica-focus', 'inicio' => $i, 'fin' => $f], $ana);
comprobar('reserva un espacio libre', $e === 201, $r);
$reservaAna = $r['id'] ?? '';
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'sala-acustica-focus', 'inicio' => $i, 'fin' => $f], $beto);
comprobar('otra persona no puede ocupar el mismo lugar', $e === 409 && $r['codigo'] === 'sinLugar', $r);
[$e] = pedir('POST', '/reservas', ['espacioId' => 'mesa-comunitaria-cafe', 'inicio' => $i, 'fin' => $f], $beto);
comprobar('mesa compartida (capacidad 3) sí admite a otra persona', $e === 201);
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'mesa-luz-natural', 'inicio' => $i, 'fin' => $f], $invitado);
comprobar('el invitado no puede reservar', $e === 403, $r);
[$i2, $f2] = horario(-2);
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'mesa-luz-natural', 'inicio' => $i2, 'fin' => $f2], $ana);
comprobar('no reserva en el pasado', $e === 422 && $r['codigo'] === 'pasado', $r);
[$i3, $f3] = horario(24 * 5);
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'mesa-luz-natural', 'inicio' => $i3, 'fin' => $f3], $ana);
comprobar('no reserva con más de 3 días', $e === 422 && $r['codigo'] === 'anticipacion', $r);
[$i4] = horario(3);
$fin4 = gmdate('Y-m-d\TH:i:s\Z', strtotime($i4) + 15 * 60);
[$e] = pedir('POST', '/reservas', ['espacioId' => 'mesa-luz-natural', 'inicio' => $i4, 'fin' => $fin4], $ana);
comprobar('solo pasos de 30 minutos', $e === 422);
[$i5, $f5] = horario(30, 79);
[$e, $r] = pedir('POST', '/reservas', ['espacioId' => 'mesa-luz-natural', 'inicio' => $i5, 'fin' => $f5], $ana);
comprobar('no alcanza con las horas del plan', $e === 422 && $r['codigo'] === 'horasInsuficientes', $r);
[$e, $r] = pedir('GET', '/horas', null, $ana);
comprobar('la reserva descuenta horas (78 disponibles)', $r['disponibles'] == 78, $r);
[$e, $r] = pedir('POST', '/horas/extra', ['horas' => 5], $ana);
comprobar('suma horas extras simuladas (83 disponibles)', $e === 200 && $r['disponibles'] == 83, $r);
[$e] = pedir('POST', '/horas/extra', ['horas' => 1000], $ana);
comprobar('solo acepta los paquetes de la app', $e === 422);
[$e] = pedir('POST', '/horas/extra', ['horas' => 5], $invitado);
comprobar('el invitado no puede sumar horas', $e === 403);

[, $r] = pedir('GET', '/espacios?desde=' . urlencode($i) . '&hasta=' . urlencode($f), null, $beto);
$sala = array_values(array_filter($r, fn ($x) => $x['id'] === 'sala-acustica-focus'))[0] ?? [];
comprobar('Beto ve la sala ocupada, sin saber por quién', count($sala['ocupaciones'] ?? []) === 1 && !isset($sala['ocupaciones'][0]['usuario_id']), $sala);
[, $r] = pedir('GET', '/espacios?desde=' . urlencode($i) . '&hasta=' . urlencode($f), null, $ana);
$sala = array_values(array_filter($r, fn ($x) => $x['id'] === 'sala-acustica-focus'))[0] ?? [];
comprobar('Ana no ve su propia reserva como ocupación ajena', ($sala['ocupaciones'] ?? null) === [], $sala);
[, $r] = pedir('GET', '/reservas', null, $beto);
comprobar('cada uno ve solo sus reservas', count($r) === 1 && $r[0]['espacioId'] === 'mesa-comunitaria-cafe', $r);
[$e] = pedir('POST', "/reservas/{$reservaAna}/cancelar", null, $beto);
comprobar('nadie cancela la reserva de otra persona', $e === 404);
[$e] = pedir('POST', "/reservas/{$reservaAna}/cancelar", null, $ana);
comprobar('cancela la propia con más de 30 min de anticipación', $e === 200);
[, $r] = pedir('GET', '/horas', null, $ana);
comprobar('al cancelar vuelven las horas', $r['disponibles'] == 85, $r);

echo "Agenda y contenido\n";
[$e, $r] = pedir('GET', '/eventos', null, $invitado);
comprobar('el invitado ve los eventos', $e === 200 && count($r) >= 1, $r);
[$e] = pedir('POST', '/eventos/coworkeo-itinerante/inscripcion', null, $invitado);
comprobar('el invitado se inscribe a un evento', $e === 200);
[$e] = pedir('POST', '/eventos/coworkeo-itinerante/inscripcion', null, $invitado);
comprobar('inscribirse dos veces no duplica', $e === 200);
[, $r] = pedir('GET', '/eventos', null, $ana);
$evento = array_values(array_filter($r, fn ($x) => $x['id'] === 'coworkeo-itinerante'))[0] ?? [];
comprobar('cuenta inscriptos sin decir quiénes', ($evento['inscriptos'] ?? 0) >= 1 && $evento['inscripto'] === false, $evento);
[$e] = pedir('DELETE', '/eventos/coworkeo-itinerante/inscripcion', null, $invitado);
comprobar('se da de baja', $e === 200);
[$e, $r] = pedir('GET', '/contenido', null, $ana);
comprobar('contenido: efemérides, novedades, talleres y beneficios', $e === 200 && count($r['efemerides']) > 30 && count($r['novedades']) === 2, array_map('count', (array) $r));

echo "Comunidad\n";
[$e] = pedir('GET', '/comunidad', null, $invitado);
comprobar('el invitado no usa Comunidad', $e === 403);
[$e, $r] = pedir('GET', '/comunidad', null, $ana);
$idsPersonas = array_column($r['personas'] ?? [], 'id');
$idBeto = pedir('GET', '/cuentas/yo', null, $beto)[1]['id'] ?? '';
comprobar('Ana ve a Beto y no se ve a sí misma', $e === 200 && in_array($idBeto, $idsPersonas, true) && count(array_filter($r['personas'], fn ($p) => $p['nombre'] === 'Ana María')) === 0, $r['personas'] ?? $r);
comprobar('los invitados no aparecen en Comunidad', count(array_filter($r['personas'], fn ($p) => $p['nombre'] === 'Invitado')) === 0);
comprobar('arranca en Conexión abierta', $r['modo'] === 'abierta', $r['modo'] ?? null);
[$e] = pedir('POST', '/publicaciones', ['tipo' => 'colaborador', 'busca' => 'Diseñador/a', 'titulo' => 'Corto', 'descripcion' => 'muy corta'], $beto);
comprobar('valida la publicación como la app', $e === 422);
[$e, $r] = pedir('POST', '/publicaciones', ['tipo' => 'colaborador', 'busca' => 'Diseñador/a UI', 'titulo' => 'App de prueba de Beto', 'descripcion' => 'Buscamos a alguien para diseñar las pantallas principales.', 'etiquetas' => ['Figma', ' ', 'UX']], $beto);
comprobar('Beto publica un proyecto', $e === 201, $r);
$publicacionBeto = $r['id'] ?? '';
[, $r] = pedir('GET', '/comunidad', null, $ana);
$pub = array_values(array_filter($r['publicaciones'], fn ($p) => $p['id'] === $publicacionBeto))[0] ?? [];
comprobar('Ana ve la publicación de Beto (no es suya)', ($pub['esPropia'] ?? true) === false && $pub['etiquetas'] === ['Figma', 'UX'], $pub);
[$e] = pedir('DELETE', "/publicaciones/{$publicacionBeto}", null, $ana);
comprobar('Ana no puede borrar la publicación de Beto', $e === 404);
[$e] = pedir('POST', '/solicitudes', ['destino' => $publicacionBeto, 'mensaje' => 'Me interesa'], $ana);
comprobar('Ana se postula a la publicación', $e === 201);
[$e] = pedir('POST', '/solicitudes', ['destino' => $publicacionBeto, 'mensaje' => 'Otra vez'], $ana);
comprobar('postularse dos veces no duplica', $e === 201);
[$e] = pedir('POST', '/solicitudes', ['destino' => $publicacionBeto, 'mensaje' => 'Me postulo a lo mío'], $beto);
comprobar('nadie se postula a su propia publicación', $e === 404);
[$e] = pedir('POST', '/solicitudes', ['destino' => $idBeto, 'mensaje' => 'Hola Beto'], $ana);
comprobar('Ana contacta a Beto', $e === 201);
[$e] = pedir('POST', '/solicitudes', ['destino' => 'club-lectura', 'mensaje' => ''], $ana);
comprobar('Ana se suma a un taller', $e === 201);
[, $r] = pedir('GET', '/comunidad', null, $ana);
$enviadas = $r['solicitudesEnviadas'] ?? [];
sort($enviadas);
$esperadas = [$publicacionBeto, $idBeto, 'club-lectura'];
sort($esperadas);
comprobar('Ana ve sus solicitudes enviadas', $enviadas === $esperadas, $r['solicitudesEnviadas'] ?? $r);
[$e] = pedir('PATCH', '/comunidad/modo', ['modo' => 'foco'], $beto);
comprobar('Beto activa el Modo Foco', $e === 200);
[, $r] = pedir('GET', '/comunidad', null, $ana);
$pub = array_values(array_filter($r['publicaciones'], fn ($p) => $p['id'] === $publicacionBeto))[0] ?? [];
comprobar('en Modo Foco Beto desaparece de la lista', !in_array($idBeto, array_column($r['personas'], 'id'), true));
comprobar('y su publicación ya no enlaza a su perfil', array_key_exists('id', $pub['autor'] ?? []) && $pub['autor']['id'] === null, $pub);
[$e] = pedir('POST', '/solicitudes', ['destino' => $idBeto, 'mensaje' => 'Hola de nuevo'], $ana);
comprobar('en Modo Foco no se lo puede contactar', $e === 404);
[$e] = pedir('DELETE', "/publicaciones/{$publicacionBeto}", null, $beto);
comprobar('Beto borra su publicación', $e === 200);

echo "Foto y perfil profesional\n";
// Imagen PNG mínima (1×1 píxel) para la prueba.
$png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
[$e] = pedir('PUT', '/cuentas/foto', ['foto' => 'data:image/png;base64,' . base64_encode('<?php echo 1; ?>')], $ana);
comprobar('rechaza archivos que no son imágenes', $e === 422);
[$e] = pedir('PUT', '/cuentas/foto', ['foto' => $png], $invitado);
comprobar('el invitado no sube foto', $e === 403);
[$e, $r] = pedir('PUT', '/cuentas/foto', ['foto' => $png], $ana);
$urlFoto = $r['fotoUrl'] ?? '';
comprobar('Ana sube su foto', $e === 200 && preg_match('#/fotos/[a-f0-9]{32}\.png$#', $urlFoto), $r);
$archivo = @file_get_contents($urlFoto);
comprobar('la foto se puede ver desde la app', $archivo !== false && str_starts_with($archivo, "\x89PNG"));
[$e, $r] = pedir('PATCH', '/cuentas/yo', ['nombre' => 'Ana María', 'profesion' => 'UX', 'sobreMi' => 'Diseño apps.', 'ofrezco' => 'Mentorías de UX', 'busco' => ''], $ana);
comprobar('guarda sobre mí y ofrezco (y busco vacío queda sin texto)', $e === 200 && $r['perfil']['sobreMi'] === 'Diseño apps.' && $r['perfil']['busco'] === null, $r);
[, $r] = pedir('PATCH', '/cuentas/yo', ['nombre' => 'Ana María', 'profesion' => 'UX'], $ana);
comprobar('editar solo nombre no borra el sobre mí', ($r['perfil']['sobreMi'] ?? null) === 'Diseño apps.', $r);
[$e] = pedir('PATCH', '/comunidad/modo', ['modo' => 'abierta'], $beto);
[, $r] = pedir('GET', '/comunidad', null, $beto);
$anaVista = array_values(array_filter($r['personas'], fn ($p) => $p['nombre'] === 'Ana María'))[0] ?? [];
comprobar('Beto ve la foto y el perfil de Ana', ($anaVista['fotoUrl'] ?? '') === $urlFoto && $anaVista['ofrezco'] === 'Mentorías de UX', $anaVista);
[$e, $r] = pedir('PUT', '/cuentas/foto', ['foto' => null], $ana);
comprobar('Ana quita su foto (y se borra el archivo)', $e === 200 && $r['fotoUrl'] === null && @file_get_contents($urlFoto) === false);
[, $r] = pedir('PUT', '/cuentas/foto', ['foto' => $png], $ana);
$urlFotoFinal = $r['fotoUrl'] ?? '';

echo "Servicios del Perfil\n";
[$e, $r] = pedir('GET', '/membresia', null, $ana);
comprobar('membresía con el plan por defecto', $e === 200 && $r['plan'] === 'Plan Pro Creativo' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $r['vence']), $r);
[$e, $r] = pedir('GET', '/membresia', null, $invitado);
comprobar('el invitado no tiene membresía', $e === 200 && $r === null, $r);
[$e, $r] = pedir('GET', '/paquetes', null, $ana);
comprobar('sin paquetes en recepción', $e === 200 && $r === [], $r);
[$e] = pedir('POST', '/valoraciones', ['espacioId' => 'sala-acustica-focus', 'estrellas' => 6], $ana);
comprobar('las estrellas van de 1 a 5', $e === 422);
[$e] = pedir('POST', '/valoraciones', ['espacioId' => 'sala-acustica-focus', 'estrellas' => 5, 'comentario' => 'Excelente'], $ana);
comprobar('valora un espacio', $e === 201);
[$e] = pedir('POST', '/mensajes', ['tipo' => 'sugerencia', 'texto' => 'corto'], $ana);
comprobar('el mensaje necesita al menos 10 caracteres', $e === 422);
[$e] = pedir('POST', '/mensajes', ['tipo' => 'sugerencia', 'texto' => 'Sumar más enchufes en la terraza.'], $ana);
comprobar('envía una sugerencia al equipo', $e === 201);
[, $r] = pedir('GET', '/opiniones', null, $ana);
comprobar('cuenta lo que envió', $r === ['valoraciones' => 1, 'mensajes' => 1], $r);
[$e] = pedir('POST', '/mensajes', ['tipo' => 'queja', 'texto' => 'Soy invitado y quiero quejarme.'], $invitado);
comprobar('el invitado no usa los servicios de miembro', $e === 403);

echo "Eliminar cuenta\n";
[$e] = pedir('DELETE', '/cuentas/yo', null, $beto);
comprobar('elimina la cuenta', $e === 200);
[$e] = pedir('GET', '/cuentas/yo', null, $beto);
comprobar('después de eliminarla, la sesión ya no sirve', $e === 401);
[$e] = pedir('POST', '/cuentas/ingreso', ['correo' => $correoBeto, 'contrasena' => 'clave-segura-2']);
comprobar('y no se puede volver a ingresar', $e === 401);
pedir('DELETE', '/cuentas/yo', null, $ana);
comprobar('al eliminar la cuenta se borra su foto', @file_get_contents($urlFotoFinal) === false);
pedir('DELETE', '/cuentas/yo', null, $invitado);
[$e] = pedir('POST', '/cuentas/salir', null, $ana);
comprobar('salir sin sesión no rompe nada', $e === 200);

echo "\n" . ($total - $fallas) . " de {$total} comprobaciones correctas.\n";
exit($fallas === 0 ? 0 : 1);
