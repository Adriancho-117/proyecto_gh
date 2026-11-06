# proyecto_gh

Aventura narrativa interactiva de horror ambientada en Trigoseco, construida con HTML, CSS y JavaScript ES Modules.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

Instala las dependencias y arranca el servidor:

```sh
npm install
npm start
```

Abre `http://localhost:3000` en el navegador. El servidor sirve los archivos estáticos desde `public/`; el puerto se puede configurar con la variable de entorno `PORT`.

## Estructura

- `server.js`: servidor Express.
- `public/`: interfaz, estilos, módulos del juego y datos narrativos (`story.json`).
- `NOTEBOOKLM_CONTEXT.md`: contexto funcional y técnico del proyecto.
