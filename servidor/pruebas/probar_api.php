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

echo "Eliminar cuenta\n";
[$e] = pedir('DELETE', '/cuentas/yo', null, $beto);
comprobar('elimina la cuenta', $e === 200);
[$e] = pedir('GET', '/cuentas/yo', null, $beto);
comprobar('después de eliminarla, la sesión ya no sirve', $e === 401);
[$e] = pedir('POST', '/cuentas/ingreso', ['correo' => $correoBeto, 'contrasena' => 'clave-segura-2']);
comprobar('y no se puede volver a ingresar', $e === 401);
pedir('DELETE', '/cuentas/yo', null, $ana);
pedir('DELETE', '/cuentas/yo', null, $invitado);
[$e] = pedir('POST', '/cuentas/salir', null, $ana);
comprobar('salir sin sesión no rompe nada', $e === 200);

echo "\n" . ($total - $fallas) . " de {$total} comprobaciones correctas.\n";
exit($fallas === 0 ? 0 : 1);
