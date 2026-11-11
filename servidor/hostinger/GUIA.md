# Subir el servidor de Olegario a Hostinger (paso a paso)

Datos (D-79): hosting compartido · dirección `https://www.supervisioncct3.com/olegario` ·
base y usuario `u275204779_olegario` · PHP 8.3.

Vas a necesitar 6 archivos (te los paso yo; también se arman con `bash servidor/hostinger/armar_paquete.sh`):
`olegario-publico.zip`, `olegario-api.zip` y `01_esquema.sql`, `02_contenido_inicial.sql`,
`03_codigos_acceso.sql`, `04_descripcion_eventos.sql`.

> 🔒 La contraseña de la base **no** se manda por el chat ni se sube a GitHub. Solo la escribís vos en el
> paso 3.

## 1. Cargar la base de datos (phpMyAdmin)

1. hPanel → **Bases de datos** → **Administración**. Al lado de `u275204779_olegario`, tocá
   **Ingresar a phpMyAdmin**.
2. A la izquierda, hacé clic en `u275204779_olegario` (tiene que quedar marcada).
3. Arriba, pestaña **Importar** → **Seleccionar archivo** → `01_esquema.sql` → abajo, **Importar**.
   Tiene que aparecer un mensaje verde.
4. Repetí lo mismo con `02_contenido_inicial.sql`, después `03_codigos_acceso.sql` y por último
   `04_descripcion_eventos.sql`. **Siempre en ese orden.**

Si en el paso 3 aparece un error rojo que dice que una tabla "already exists", la base no estaba vacía:
pará y avisame.

## 2. Subir los archivos (Administrador de archivos)

1. hPanel → **Sitios web** → `supervisioncct3.com` → **Administrador de archivos**.
2. Entrá a la carpeta **`public_html`**. Subí `olegario-publico.zip` (botón de subir, arriba a la
   derecha). Clic derecho sobre el zip → **Extraer** → aceptar. Tiene que aparecer la carpeta
   `olegario` (con `index.php`, `.htaccess` y `fotos`). Después borrá el zip.
3. Volvé **una carpeta atrás** (la que contiene `public_html`). Subí ahí `olegario-api.zip`, extraelo y
   borrá el zip. Tiene que aparecer la carpeta `olegario-api`, **al lado** de `public_html`, no adentro.

Así queda:

```
supervisioncct3.com/
├── public_html/
│   ├── (tu sitio actual, sin cambios)
│   └── olegario/          ← lo que se ve desde internet
│       ├── index.php
│       ├── .htaccess
│       └── fotos/
└── olegario-api/          ← privado: código y contraseña
    ├── config.php
    └── src/
```

## 3. Escribir la contraseña (solo vos)

1. Abrí `olegario-api/config.php` (doble clic o clic derecho → **Editar**).
2. En la línea `'DB_PASSWORD' => '',` escribí la contraseña de la base **entre las dos comillas**, por
   ejemplo `'DB_PASSWORD' => 'tu-contraseña',`. No cambies nada más.
3. **Guardar**.

## 4. Comprobar

1. Abrí en el navegador: **https://www.supervisioncct3.com/olegario/salud**
2. Tiene que decir: `{"ok":true,"base":true}` → ¡el servidor funciona! Avisame.

Si sale otra cosa, mandame una captura (sin la contraseña):

| Lo que ves                           | Qué pasa                                                             |
| ------------------------------------ | -------------------------------------------------------------------- |
| "No pudimos completar la operación…" | La contraseña o el nombre de la base no coinciden (revisá el paso 3) |
| Página de error 404 de Hostinger     | La carpeta `olegario` no quedó dentro de `public_html`               |
| Error 500                            | La carpeta `olegario-api` no quedó al lado de `public_html`          |
| El navegador avisa que no es seguro  | Falta activar el SSL del dominio (hPanel → Seguridad → SSL)          |

## 5. Después (lo hago yo, con tu aprobación)

- La app apunta al servidor: `EXPO_PUBLIC_API_URL=https://www.supervisioncct3.com/olegario`.
- Plano de reservas: `API_URL` en `config.js`, publicar su rama y `PLANO_CONECTADO_AL_SERVIDOR = true`.
- Recuperar contraseña por correo con `olegario@supervisioncct3.com` (P-48).
