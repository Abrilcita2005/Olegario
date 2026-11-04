-- Olegario en Movimiento · Esquema MySQL (Etapa 13). PENDIENTE DE APROBACIÓN de la responsable.
-- Reemplaza al esquema de Supabase (supabase/0001_esquema_inicial.sql) con las mismas tablas y reglas.
-- Docker lo ejecuta solo la primera vez que arranca MySQL (ver servidor/docker-compose.yml).
--
-- Diferencias con Supabase (en palabras simples):
--  * Las cuentas y las sesiones las guarda esta base (tablas `usuarios` y `sesiones`); la contraseña se
--    guarda cifrada con password_hash de PHP, nunca en texto.
--  * MySQL no tiene "reglas por fila" (RLS): quién ve qué lo controla la API en PHP, que siempre filtra
--    por la persona con sesión. La app nunca se conecta directo a MySQL.
--  * Las reglas de reserva (pasos de 30 min, hasta 3 días, lugar libre, horas, cancelar hasta 30 min
--    antes) las controla la API dentro de una transacción; los CHECK de abajo son una segunda barrera.
--  * Fechas y horas en UTC.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ───────────── Cuentas ─────────────
CREATE TABLE usuarios (
  id CHAR(36) PRIMARY KEY,
  correo VARCHAR(254) UNIQUE,                    -- NULL en el Modo invitado
  contrasena_hash VARCHAR(255),                  -- NULL en el Modo invitado
  es_invitado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (es_invitado OR (correo IS NOT NULL AND contrasena_hash IS NOT NULL))
) ENGINE=InnoDB;

-- Sesiones abiertas: la app guarda el token (cifrado en el teléfono); acá solo se guarda su huella.
CREATE TABLE sesiones (
  token_hash CHAR(64) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vence DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE perfiles (
  id CHAR(36) PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  profesion VARCHAR(80) NOT NULL DEFAULT '',
  foto_url TEXT,
  rol ENUM('miembro', 'invitado', 'equipo') NOT NULL DEFAULT 'miembro',
  modo_comunidad ENUM('abierta', 'foco') NOT NULL DEFAULT 'abierta',
  sobre_mi VARCHAR(600),
  ofrezco VARCHAR(300),
  busco VARCHAR(300),
  disponible BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (CHAR_LENGTH(nombre) >= 2),
  FOREIGN KEY (id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ───────────── Membresía y horas ─────────────
CREATE TABLE membresias (
  usuario_id CHAR(36) PRIMARY KEY,
  plan VARCHAR(80) NOT NULL DEFAULT 'Plan Pro Creativo',
  acceso VARCHAR(80) NOT NULL DEFAULT 'Acceso 24/7 · Puesto Nómade',
  horas_mensuales INT NOT NULL DEFAULT 80,
  horas_extra DECIMAL(6, 1) NOT NULL DEFAULT 0,
  vence DATE,
  renovacion_automatica BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (horas_mensuales >= 0 AND horas_extra >= 0),
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ───────────── Espacios y reservas ─────────────
CREATE TABLE espacios (
  id VARCHAR(60) PRIMARY KEY,
  servicio ENUM('cowork', 'stream', 'network', 'cafe') NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  ubicacion VARCHAR(160) NOT NULL,
  ambiente JSON NOT NULL,                        -- lista de textos, por ejemplo ["Luz natural directa"]
  equipamiento JSON NOT NULL,
  etiqueta VARCHAR(40),
  foto_url TEXT,
  capacidad INT NOT NULL DEFAULT 1,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (capacidad > 0)
) ENGINE=InnoDB;

CREATE TABLE reservas (
  id CHAR(36) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  espacio_id VARCHAR(60) NOT NULL,
  inicio DATETIME NOT NULL,
  fin DATETIME NOT NULL,
  cancelada BOOLEAN NOT NULL DEFAULT FALSE,
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fin_despues_del_inicio CHECK (fin > inicio),
  -- Pasos de 30 minutos (regla de la responsable, 2026-11-04).
  CONSTRAINT pasos_de_30_minutos CHECK (
    MINUTE(inicio) IN (0, 30) AND SECOND(inicio) = 0 AND MINUTE(fin) IN (0, 30) AND SECOND(fin) = 0
  ),
  INDEX ocupacion (espacio_id, inicio, fin),
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE,
  FOREIGN KEY (espacio_id) REFERENCES espacios (id)
) ENGINE=InnoDB;

-- ───────────── Agenda, novedades y comunidad (contenido del equipo) ─────────────
CREATE TABLE eventos (
  id VARCHAR(60) PRIMARY KEY,
  submarca ENUM('evento', 'afterOffice', 'itinerante') NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  detalle VARCHAR(200) NOT NULL DEFAULT '',
  inicio DATETIME NOT NULL,
  foto_url TEXT,
  cupo INT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (cupo IS NULL OR cupo > 0)
) ENGINE=InnoDB;

CREATE TABLE efemerides (
  id VARCHAR(60) PRIMARY KEY,
  mes TINYINT NOT NULL,
  dia TINYINT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  texto VARCHAR(400) NOT NULL,
  beneficio VARCHAR(200),
  CHECK (mes BETWEEN 1 AND 12 AND dia BETWEEN 1 AND 31)
) ENGINE=InnoDB;

CREATE TABLE novedades (
  id VARCHAR(60) PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  texto VARCHAR(400) NOT NULL,
  descuento VARCHAR(40),
  foto_url TEXT,
  accion ENUM('carta', 'inscripcion') NOT NULL,
  evento_id VARCHAR(60),
  orden INT NOT NULL DEFAULT 0,
  vigente_hasta DATE,
  FOREIGN KEY (evento_id) REFERENCES eventos (id)
) ENGINE=InnoDB;

CREATE TABLE talleres (
  id VARCHAR(60) PRIMARY KEY,
  tipo VARCHAR(80) NOT NULL,
  cuando VARCHAR(80) NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descripcion VARCHAR(400) NOT NULL,
  accion VARCHAR(60) NOT NULL DEFAULT 'Sumarse'
) ENGINE=InnoDB;

CREATE TABLE inscripciones (
  usuario_id CHAR(36) NOT NULL,
  evento_id VARCHAR(60) NOT NULL,
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, evento_id),
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE,
  FOREIGN KEY (evento_id) REFERENCES eventos (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE publicaciones (
  id CHAR(36) PRIMARY KEY,
  autor_id CHAR(36) NOT NULL,
  tipo ENUM('colaborador', 'iniciativa') NOT NULL,
  busca VARCHAR(50),
  titulo VARCHAR(80) NOT NULL,
  descripcion VARCHAR(400) NOT NULL,
  etiquetas JSON NOT NULL,
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (CHAR_LENGTH(titulo) >= 5 AND CHAR_LENGTH(descripcion) >= 20),
  FOREIGN KEY (autor_id) REFERENCES perfiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Solicitudes de contacto/postulación: las ve quien la envía y quien la recibe (lo controla la API).
CREATE TABLE solicitudes (
  id CHAR(36) PRIMARY KEY,
  de_id CHAR(36) NOT NULL,
  para_perfil CHAR(36),
  publicacion_id CHAR(36),
  taller_id VARCHAR(60),
  mensaje VARCHAR(300) NOT NULL DEFAULT '',
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Exactamente uno de los tres destinos: lo controla la API (MySQL no admite un CHECK sobre columnas
  -- que se borran en cascada).
  FOREIGN KEY (de_id) REFERENCES perfiles (id) ON DELETE CASCADE,
  FOREIGN KEY (para_perfil) REFERENCES perfiles (id) ON DELETE CASCADE,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
  FOREIGN KEY (taller_id) REFERENCES talleres (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ───────────── Perfil de cuenta: servicios ─────────────
CREATE TABLE paquetes (
  id CHAR(36) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  estado VARCHAR(120) NOT NULL DEFAULT 'Listo para retirar en recepción principal',
  retirado BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE beneficios (
  id VARCHAR(60) PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  detalle VARCHAR(200) NOT NULL,
  lugar VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE valoraciones (
  id CHAR(36) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  espacio_id VARCHAR(60) NOT NULL,
  estrellas TINYINT NOT NULL,
  comentario VARCHAR(300) NOT NULL DEFAULT '',
  creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (estrellas BETWEEN 1 AND 5),
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE,
  FOREIGN KEY (espacio_id) REFERENCES espacios (id)
) ENGINE=InnoDB;

CREATE TABLE mensajes_equipo (
  id CHAR(36) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  tipo ENUM('queja', 'sugerencia') NOT NULL,
  texto VARCHAR(600) NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (CHAR_LENGTH(texto) >= 10),
  FOREIGN KEY (usuario_id) REFERENCES perfiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;
