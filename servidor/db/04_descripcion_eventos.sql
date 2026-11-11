-- Olegario en Movimiento · Descripción larga de los eventos (aprobado por la responsable, 2026-11-11, D-75).
-- Se muestra en la pantalla de detalle del evento (Agenda y Novedades). La carga el equipo desde
-- phpMyAdmin (tabla eventos, columna descripcion).
-- Docker lo ejecuta la primera vez (después de 01, 02 y 03). En una base que ya existe se ejecuta UNA vez
-- a mano desde phpMyAdmin (pestaña SQL): MySQL no permite agregar la misma columna dos veces.

SET NAMES utf8mb4;

ALTER TABLE eventos ADD COLUMN descripcion VARCHAR(1000) NULL AFTER detalle;

-- TEXTOS DE EJEMPLO (no reales), escritos para mostrar la pantalla: el equipo los reemplaza.
UPDATE eventos SET descripcion = 'Un taller práctico para contar tu proyecto en pocos minutos: cómo armar una historia que enganche, qué mostrar en una presentación y cómo adaptar el mensaje a cada público. Traé tu idea: trabajamos en grupos chicos y con devoluciones en el momento.'
WHERE id = 'evento-storytelling';
UPDATE eventos SET descripcion = 'Cerramos la semana en la terraza con un DJ set de vinilos al atardecer. Música, buena charla y algo rico de OLE/CAFÉ para conocer a otras personas de la comunidad.'
WHERE id = 'evento-sunset-beats';
UPDATE eventos SET descripcion = 'Una jornada de trabajo fuera de Olegario: viajamos en grupo a un lugar distinto de Mendoza, armamos la oficina por un día y cerramos con un almuerzo compartido. Ideal para cambiar de aire y conocer gente nueva.'
WHERE id = 'coworkeo-itinerante';
