# Olegario en Movimiento

App móvil de **Olegario Coworking** (Mendoza) para iOS y Android: espacios, agenda, comunidad, novedades y cuenta de cada miembro.

> Estado: **Etapa 3 — esqueleto del proyecto**. Las pantallas todavía son marcadores "en construcción".
> Documentación completa en [`docs/`](docs/) (empezar por `docs/ESTADO_DEL_PROYECTO.md`).

## Requisitos

| Programa                               | Para qué                               | Dónde se consigue       |
| -------------------------------------- | -------------------------------------- | ----------------------- |
| Node.js 20 o superior (probado con 22) | Ejecutar las herramientas del proyecto | https://nodejs.org      |
| Git                                    | Descargar el código                    | https://git-scm.com     |
| App **Expo Go** (opcional)             | Probar la app en tu teléfono           | App Store / Google Play |

## Correr el proyecto desde cero

1. Descargar el código: `git clone https://github.com/Abrilcita2005/Olegario.git` y entrar a la carpeta.
2. Instalar dependencias: `npm install`
3. Crear `.env` a partir de `.env.example` (por ahora no hace falta ninguna variable).
4. Levantar: `npm start`
   - En el teléfono: escanear el código QR con Expo Go (el teléfono y la computadora en la misma red Wi‑Fi).
   - En el navegador: tecla `w`, o `npm run web`.

## Comandos útiles

| Comando                          | Qué hace                                                     |
| -------------------------------- | ------------------------------------------------------------ |
| `npm start`                      | Servidor de desarrollo (Expo)                                |
| `npm run web`                    | Abre la app en el navegador                                  |
| `npm test`                       | Pruebas automáticas (Jest)                                   |
| `npm run typecheck`              | Revisión de tipos (TypeScript)                               |
| `npm run lint`                   | Revisión de código (ESLint)                                  |
| `npm run format`                 | Da formato a los archivos (Prettier)                         |
| `npm run verificar`              | Todo lo anterior junto: lo que se corre antes de cada commit |
| `npx expo export --platform all` | Compila los paquetes de iOS, Android y web (comprobación)    |

## Estructura

```
src/
  app/            Pantallas y rutas (Expo Router). (tabs)/ = pestañas inferiores
  components/     Componentes reutilizables
  theme/          Tokens de diseño (Etapa 4)
  services/       Acceso a datos
  models/         Tipos de datos
  hooks/  utils/
assets/           imagenes/, iconos/, fuentes/
data/mock/        Datos de prueba (identificados como tales)
tests/            Pruebas automáticas
docs/             Guía maestra, diseño, pantallas, plan y estado
```

## Publicar

Todavía no aplica. Se hará con EAS Build en la Etapa 15, solo con aprobación (publicar en tiendas tiene costos).
