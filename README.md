# La Cacería del Demonio Dorado

Aventura narrativa interactiva ambientada en Jonia. Elige opciones para avanzar por la historia; completar el primer acto desbloquea el segundo.

## Requisitos

- Node.js 18 o superior
- npm

## Ejecutar localmente

```sh
npm install
npm start
```

Abre <http://localhost:3000>. El servidor usa el puerto indicado por la variable de entorno `PORT` o, si no está definida, el puerto `3000`.

## API

- `GET /api/actos/1`: obtiene los datos del primer acto.
- `GET /api/actos/2`: obtiene los datos del segundo acto.

Los archivos JSON de los actos están en `public/`; Express sirve también desde allí la interfaz estática.

## Características

- Interfaz adaptable con Bootstrap.
- Tema claro/oscuro y desbloqueo del segundo acto guardados en `localStorage`.
- Navegación por opciones con el teclado usando las teclas `1` a `9`.

## Estructura

- `server.js`: servidor Express y endpoints de los actos.
- `public/`: interfaz, módulos del juego, estilos y datos de la historia.
