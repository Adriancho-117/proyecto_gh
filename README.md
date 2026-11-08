# La Cacería del Demonio Dorado

Aventura narrativa interactiva construida con HTML, CSS y JavaScript ES Modules. El proyecto integra JavaScript moderno, DOM, eventos, Express, conectividad cliente-servidor, persistencia del navegador, Bootstrap, UX y despliegue con enfoque de la rúbrica del segundo corte.

## Cumplimiento técnico con la rúbrica

- JavaScript moderno y módulos ES: el proyecto usa `import`/`export`, `let`/`const`, comparaciones estrictas y módulos para lógica, render y estado.
- Node.js y Express: el servidor está en `server.js` y sirve la aplicación y sus archivos JSON estáticos.
- Conexión cliente-servidor: el frontend carga los archivos JSON servidos desde `public/` con `fetch` y `async/await`.
- Seguridad: CORS limitado, validación en el servidor y manejo seguro de entradas; no se usa `innerHTML` con contenido dinámico.
- Persistencia: `localStorage` permite desbloquear el Acto II y guardar la preferencia entre el tema claro y el tema oscuro CRT Matrix; `sessionStorage` guarda el último progreso del usuario en la sesión actual.
- Bootstrap y diseño adaptable: el proyecto usa Bootstrap 5, `meta viewport` y un layout responsivo con diseño de juego.
- UX y accesibilidad: mensajes de carga, `aria-live`, `aria-label` y foco con teclado para la navegación por elecciones.
- GitHub y README: el repositorio incluye `.gitignore`, `.env.example` y documentación de ejecución.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

```sh
npm install
npm start
```

`npm start` sirve la aplicación y abre `http://localhost:3000` en el navegador local. Si el navegador no se abre automáticamente, visita esa dirección manualmente. El backend sirve `public/index.html` y la API necesaria para el juego.

Para desarrollo con reinicio automático del servidor al cambiar archivos, ejecuta `npm run dev` y abre `http://localhost:3000`.

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example` si necesitas cambiar el puerto o los orígenes permitidos: 

```env
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

El puerto puede ajustarse con `PORT`, y la lista de orígenes permitidos se define en `CORS_ORIGIN`.

## Historia y progreso

- Los datos de los actos viven en `public/acto_1_sombras_de_zhyun .json` y `public/acto_2_caceria-jhin.json`.
- El frontend carga cada acto mediante su ruta de archivo estático: `/acto_1_sombras_de_zhyun%20.json` y `/acto_2_caceria-jhin.json`.
- El desbloqueo del Acto II se guarda en `localStorage` del navegador.
- El tema oscuro es CRT Matrix: combina scanlines y viñeta con el marco retro de Windows 95. El botón de tema alterna entre este modo y el tema claro, y recuerda la preferencia en `localStorage`.
- El último avance del usuario se conserva temporalmente en `sessionStorage` para reiniciar sesión actual sin perder el hilo de la historia.
- Para reiniciar el desbloqueo, borra la clave `jhin-act-1-complete` en el almacenamiento local del sitio.

## Estructura del proyecto

- `server.js`: servidor Express para los archivos estáticos de `public/`.
- `public/`: interfaz, estilos, módulos del juego y datos narrativos.
- `README.md`: documentación del proyecto y plan de trabajo.
