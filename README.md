# La Cacería del Demonio Dorado

Aventura narrativa interactiva construida con HTML, CSS y JavaScript ES Modules. El menú principal permite jugar los dos actos en secuencia; el Acto II aparece al completar el final del Acto I.

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

## Historia y progreso

- Los datos de los actos viven en `public/acto-1-caceria-jhin.json` y `public/acto-2-caceria-jhin.json`.
- Las elecciones se cargan directamente desde esos archivos.
- El desbloqueo del Acto II se guarda en `localStorage` del navegador. Se conserva en ese navegador, pero no se sincroniza entre dispositivos ni perfiles.
- Para reiniciar el desbloqueo, borra la clave `jhin-act-1-complete` del almacenamiento local del sitio.

## Estructura

- `server.js`: servidor Express.
- `public/`: interfaz, estilos, módulos del juego y datos narrativos de ambos actos.
