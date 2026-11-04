-- Olegario en Movimiento · Contenido inicial MySQL (Etapa 13).
-- Docker lo carga solo la primera vez (después de 01_esquema.sql). También se puede ejecutar a mano
-- desde phpMyAdmin (pestaña SQL) más de una vez: si un dato ya existe, se actualiza.
-- Compatible con MySQL 8 y MariaDB (Hostinger puede usar cualquiera de los dos).
-- IMPORTANTE: espacios, eventos, novedades, talleres y beneficios son los EJEMPLOS de Figma que usa la
-- app hoy; el equipo de Olegario los reemplaza por los reales desde phpMyAdmin. Las efemérides son
-- fechas reales (data/efemerides.ts). Las fotos se suben más adelante (foto_url vacío por ahora).
-- Horas en UTC: Mendoza es UTC−3 todo el año (por eso las 17 hs de Mendoza se guardan como 20 hs).

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO espacios (id, servicio, nombre, tipo, ubicacion, ambiente, equipamiento, etiqueta, capacidad) VALUES
  ('rincon-botanico-zen', 'cowork', 'Rincón Botánico Zen', 'Puesto individual', 'Ala Oeste · Nivel 1 · Frente a jardín interior', JSON_ARRAY('Luz natural directa', 'Silencio alto'), JSON_ARRAY('Tomas USB-C 65W', 'Herman Miller Sayl', 'Aire purificado'), NULL, 1),
  ('mesa-luz-natural', 'cowork', 'Mesa con Luz Natural', 'Puesto individual', 'Sector Jardín · Puesto #14', JSON_ARRAY('Luz natural directa'), JSON_ARRAY('Tomas USB-C 65W', 'WiFi 6E Mesh 500Mbps'), NULL, 1),
  ('mesa-comunitaria-cafe', 'cafe', 'Mesa Comunitaria Barra Cafetería', 'Mesa compartida', 'Planta Alta', JSON_ARRAY('Murmullo alegre', 'Barra de especialidad'), JSON_ARRAY('WiFi 6E Mesh 500Mbps', 'Espresso bar libre', 'Pérgola bioclimática'), 'Comunidad', 3),
  ('sala-acustica-focus', 'stream', 'Sala Acústica Focus', 'Sala de stream y llamadas', 'Sala Central · Pods de Stream & Calls', JSON_ARRAY('-32dB aislación', 'Ilum. Broadcast'), JSON_ARRAY('Cámara 4K + Brazo Elgato', 'Mic Rode PodMic'), NULL, 1)
ON DUPLICATE KEY UPDATE servicio = VALUES(servicio), nombre = VALUES(nombre), tipo = VALUES(tipo), ubicacion = VALUES(ubicacion), ambiente = VALUES(ambiente), equipamiento = VALUES(equipamiento), etiqueta = VALUES(etiqueta), capacidad = VALUES(capacidad);

INSERT INTO efemerides (id, mes, dia, titulo, texto) VALUES
  ('braille', 1, 4, 'Día mundial del Braille', 'Un recordatorio de que la información y la creatividad tienen que llegar a todas las personas.'),
  ('san-martin-natalicio', 2, 25, 'Natalicio del General San Martín', 'Desde Mendoza organizó el Ejército de los Andes: una historia de visión y trabajo en equipo.'),
  ('fundacion-mendoza', 3, 2, 'Aniversario de la fundación de Mendoza', 'Mendoza fue fundada en 1561. Celebramos la ciudad que nos inspira y nos reúne.'),
  ('mujer', 3, 8, 'Día internacional de la mujer', 'Celebramos a las mujeres que emprenden, crean y lideran en nuestra comunidad.'),
  ('felicidad', 3, 20, 'Día internacional de la felicidad', 'Trabajar en buena compañía también es una forma de bienestar.'),
  ('poesia', 3, 21, 'Día mundial de la poesía', 'Las palabras también construyen: un buen día para escribir algo que no sea un mail.'),
  ('teatro', 3, 27, 'Día mundial del teatro', 'Un homenaje a las artes escénicas y a quienes se animan a subir al escenario.'),
  ('arte', 4, 15, 'Día mundial del arte', 'El arte inspira ideas nuevas: dejá que se cuele en tu jornada de trabajo.'),
  ('malbec', 4, 17, 'Día mundial del Malbec', 'La cepa que hizo conocida a Mendoza en el mundo. Un orgullo de nuestra tierra.'),
  ('creatividad', 4, 21, 'Día mundial de la creatividad y la innovación', 'Las ideas que cambian las cosas suelen nacer de una conversación. Compartí la tuya.'),
  ('libro', 4, 23, 'Día internacional del libro', 'Recomendá a la comunidad el libro que más te inspiró en tu trabajo.'),
  ('propiedad-intelectual', 4, 26, 'Día mundial de la propiedad intelectual', 'Proteger lo que creás es parte de hacer crecer tu proyecto.'),
  ('diseno', 4, 27, 'Día mundial del diseño', 'Celebramos el impacto del diseño en cómo vivimos, trabajamos y nos comunicamos.'),
  ('trabajador', 5, 1, 'Día del trabajador', 'Un saludo a todas las personas que hacen su trabajo con dedicación todos los días.'),
  ('internet', 5, 17, 'Día de internet', 'La red que nos conecta con clientes, equipos y comunidades de todo el mundo.'),
  ('museos', 5, 18, 'Día internacional de los museos', 'Una buena excusa para visitar un museo de Mendoza y volver con ideas nuevas.'),
  ('diversidad-cultural', 5, 21, 'Día mundial de la diversidad cultural', 'Las miradas distintas enriquecen los proyectos: la diversidad es parte de nuestra comunidad.'),
  ('medio-ambiente', 6, 5, 'Día mundial del medio ambiente', 'Pequeños hábitos en el espacio de trabajo también cuidan el planeta.'),
  ('escritor', 6, 13, 'Día del escritor', 'Un homenaje a quienes escriben, en Argentina, en el natalicio de Leopoldo Lugones.'),
  ('musica', 6, 21, 'Día mundial de la música', 'Armá la playlist de tu jornada y compartila con la comunidad.'),
  ('pymes', 6, 27, 'Día de las microempresas y las pymes', 'Celebramos a los proyectos chicos que mueven la economía, como muchos de los que trabajan acá.'),
  ('habilidades-juventud', 7, 15, 'Día mundial de las habilidades de la juventud', 'Aprender algo nuevo siempre suma: compartí lo que sabés con quienes recién empiezan.'),
  ('santiago-apostol', 7, 25, 'Día de Santiago Apóstol, patrono de Mendoza', 'Feriado provincial en Mendoza: un día para disfrutar de la ciudad.'),
  ('juventud', 8, 12, 'Día internacional de la juventud', 'Las nuevas generaciones traen ideas frescas a la forma de trabajar.'),
  ('san-martin-inmortalidad', 8, 17, 'Paso a la inmortalidad del General San Martín', 'Recordamos al libertador que hizo de Mendoza el punto de partida de su gesta.'),
  ('fotografia', 8, 19, 'Día mundial de la fotografía', 'Una imagen cuenta una historia: ¿cuál es la de tu proyecto?'),
  ('paz', 9, 21, 'Día internacional de la paz', 'Construir comunidad también es construir convivencia.'),
  ('cafe', 10, 1, 'Día internacional del café', 'El combustible de las buenas ideas. Pasá por OLE/CAFÉ y brindá con la comunidad.'),
  ('animales', 10, 4, 'Día mundial de los animales', 'Un saludo a los compañeros de cuatro patas que nos acompañan en casa y en la oficina.'),
  ('salud-mental', 10, 10, 'Día mundial de la salud mental', 'Hacer pausas, pedir ayuda y cuidarnos también es parte del trabajo.'),
  ('alimentacion', 10, 16, 'Día mundial de la alimentación', 'Comer bien es parte de rendir bien: regalate una pausa para almorzar con calma.'),
  ('amabilidad', 11, 13, 'Día mundial de la amabilidad', 'Un gesto amable cambia el día de alguien. Hoy es un buen día para tenerlo.'),
  ('tolerancia', 11, 16, 'Día internacional para la tolerancia', 'Escuchar ideas distintas a las nuestras nos hace crecer como comunidad.'),
  ('vino-argentino', 11, 24, 'Día del vino argentino, bebida nacional', 'Mendoza es tierra de vinos: brindamos por el trabajo de quienes lo hacen posible.'),
  ('discapacidad', 12, 3, 'Día internacional de las personas con discapacidad', 'Espacios y herramientas accesibles hacen que todas las personas puedan sumarse.'),
  ('voluntariado', 12, 5, 'Día internacional del voluntariado', 'Gracias a quienes donan su tiempo y su talento a causas que nos importan.'),
  ('derechos-humanos', 12, 10, 'Día de los derechos humanos', 'Un día para recordar los derechos que nos igualan a todas las personas.')
ON DUPLICATE KEY UPDATE mes = VALUES(mes), dia = VALUES(dia), titulo = VALUES(titulo), texto = VALUES(texto);

-- Eventos de ejemplo de Figma, a partir de mañana (hora de Mendoza, guardada en UTC).
INSERT INTO eventos (id, submarca, titulo, detalle, inicio) VALUES
  ('evento-storytelling', 'evento', 'Storytelling para Emprendedores', 'Disertante: Sofía Valenzuela · Sala Principal', TIMESTAMP(DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) + INTERVAL 1 DAY, '20:00:00')),
  ('evento-sunset-beats', 'afterOffice', 'Sunset Beats & Vinyl Session', 'Terraza Abierta Olegario · DJ Set en vivo', TIMESTAMP(DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) + INTERVAL 2 DAY, '21:30:00')),
  ('coworkeo-itinerante', 'itinerante', 'Coworkeo itinerante', '¡Viajá con Olegario y conocé personas y lugares nuevos!', TIMESTAMP(DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) + INTERVAL 7 DAY, '12:00:00'))
ON DUPLICATE KEY UPDATE submarca = VALUES(submarca), titulo = VALUES(titulo), detalle = VALUES(detalle), inicio = VALUES(inicio);

INSERT INTO novedades (id, titulo, texto, descuento, accion, evento_id, orden) VALUES
  ('promo-cafeteria', 'Promo cafetería', 'Flat White de especialidad + Cookie casera de chocolate', '20% OFF', 'carta', NULL, 1),
  ('coworkeo-itinerante', 'Coworkeo itinerante', '¡Viajá con Olegario y conocé personas y lugares nuevos!', '20% OFF', 'inscripcion', 'coworkeo-itinerante', 2)
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), texto = VALUES(texto), descuento = VALUES(descuento), accion = VALUES(accion), evento_id = VALUES(evento_id), orden = VALUES(orden);

INSERT INTO talleres (id, tipo, cuando, titulo, descripcion, accion) VALUES
  ('club-lectura', 'Grupo de interés', 'Miércoles · 18:30 hs', 'Club de Lectura Tech & Diseño', 'Espacio quincenal para debatir ensayos de diseño, sistemas complejos e IA aplicada al trabajo independiente.', 'Sumarse'),
  ('debate-no-code', 'Workshop co-aprendizaje', 'Jueves · 17:00 hs', 'Mesa de Debate No-Code & Automatización', 'Mostramos flujos de trabajo reales con Make, Airtable y Supabase creados por coworkers de la comunidad.', 'Últimos cupos disponibles')
ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), cuando = VALUES(cuando), titulo = VALUES(titulo), descripcion = VALUES(descripcion), accion = VALUES(accion);

INSERT INTO beneficios (id, titulo, detalle, lugar) VALUES
  ('promo-cafeteria', '20% OFF en la cafetería', 'Flat White de especialidad + Cookie casera de chocolate', 'OLE/CAFÉ')
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), detalle = VALUES(detalle), lugar = VALUES(lugar);
