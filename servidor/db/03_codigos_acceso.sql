-- Olegario en Movimiento · Códigos de acceso al plano de reservas (aprobado por la responsable, 2026-11-11, D-73).
-- La app pide un código de un solo uso que vence en un minuto y abre el plano (olegario-reservas) con él;
-- el plano lo canjea por una sesión propia. Así la persona entra al plano sin volver a escribir su contraseña.
-- En la base se guarda solo la huella (SHA-256) del código, nunca el código.
-- Docker lo ejecuta la primera vez (después de 01 y 02). En una base que ya existe, se ejecuta a mano desde
-- phpMyAdmin (pestaña SQL); se puede ejecutar más de una vez.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS codigos_acceso (
  codigo_hash CHAR(64) PRIMARY KEY,
  usuario_id CHAR(36) NOT NULL,
  vence DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;
