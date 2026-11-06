# Contexto integral del proyecto

## 1. Resumen ejecutivo

`proyecto_gh` es un prototipo de aventura narrativa interactiva para navegador, escrito con JavaScript moderno (módulos ES) y HTML/CSS nativos. El jugador explora una historia de horror ambientada en Trigoseco, un valle de Runaterra al oeste de Demacia, y toma decisiones que alteran sus recursos, objetos y desenlace.

La historia y sus decisiones se describen en un archivo JSON separado del motor. La interfaz muestra el texto de cada escena, las opciones disponibles, la vida, la cordura y el inventario. No hay un framework de interfaz ni una base de datos.

Este documento describe el estado de los archivos encontrados en el repositorio. No presupone funcionalidades futuras ni da por corregidas las inconsistencias de ejecución indicadas más adelante.

## 2. Propósito y experiencia de juego

El proyecto busca ofrecer una experiencia breve de ficción interactiva con una presentación de consola retro y elementos de horror psicológico. La interfaz combina:

- Una pantalla de estado con vida, cordura e inventario.
- Escenas narrativas y decisiones con requisitos de objetos.
- Consecuencias numéricas al entrar a escenas o seleccionar opciones.
- Finales distintos según las acciones, los recursos y los objetos reunidos.
- Un efecto visual de líneas CRT que el jugador puede activar o desactivar.

El progreso de la aventura se mantiene únicamente en memoria durante la sesión actual. La preferencia del efecto CRT sí se guarda en `localStorage`.

## 3. Mundo, premisa y argumento

La aventura comienza cuando el personaje jugador llega a Trigoseco para investigar la desaparición de las cosechas y de las patrullas enviadas al valle. El trigo, los cuervos y los espantapájaros parecen participar de una presencia hostil que imita voces y recuerdos. El guardabosques Ardyn advierte que no se debe responder a las voces ni mirar demasiado tiempo a los espantapájaros.

La exploración conduce desde el camino y el lindero hasta un claro central y un enfrentamiento con una entidad construida de madera, paja, telas y guadañas. El jugador puede resistirse, escapar o negociar; los objetos disponibles abren rutas de acción distintas, pero no garantizan por sí solos un resultado seguro.

### Objetos importantes

- **Amuleto de hierbas (`amuleto`)**: lo entrega Ardyn si se visita su choza. Puede ayudar a resistir la pérdida de cordura.
- **Daga de plata (`daga`)**: puede obtenerse de Ardyn o encontrarse entre los espantapájaros. Es útil contra la entidad.
- **Grimorio quemado del Alba (`grimorio`)**: se encuentra en el altar del claro y permite intentar un ritual.

### Desenlaces

El JSON declara seis escenas finales:

- `final_muerte`: el personaje es cosechado y convertido en un espantapájaros.
- `final_locura`: el personaje sobrevive físicamente, pero queda sin identidad ni memoria.
- `final_cosechado`: una confrontación sin herramientas termina en muerte.
- `final_pacto`: el personaje escapa entregando el grimorio, pero pierde su voz.
- `final_huida`: logra escapar; persiste una amenaza.
- `final_exorcismo`: la entidad parece destruida, aunque el texto deja abierta la posibilidad de que el mal continúe.

En los datos, `final_huida` y `final_exorcismo` llevan `good: true`; los otros cuatro, `good: false`. Esa marca se usa para dar estilo visual a la etiqueta del final, no para calcular una puntuación.

## 4. Estructura narrativa y datos

La historia está en `story.json` y contiene **23 nodos**. Los nodos de escena tienen, según el caso:

- `title`: encabezado de la escena.
- `text`: lista de párrafos narrativos.
- `choices`: decisiones disponibles.
- `onEnter`: efectos aplicados al entrar a la escena.
- `isEnding`, `tag` y `good`: metadatos de presentación de un final.

Cada decisión puede definir:

- `label`: texto presentado al jugador.
- `next`: identificador del nodo de destino.
- `fx`: efectos aplicados al escogerla.
- `requires`: objetos que se deben tener para mostrarla.
- `hideIf`: objetos cuya posesión oculta esa decisión.

Las referencias de destino presentes en las opciones del JSON se resuelven a nodos existentes. Veintiún nodos son alcanzables recorriendo las opciones desde `inicio`; los otros dos finales (`final_muerte` y `final_locura`) son alcanzados por las comprobaciones de estado del motor, no mediante enlaces directos en las opciones.

## 5. Mecánicas y reglas

- La vida (`hp`) y la cordura (`sanity`) comienzan en 100 y se limitan al intervalo de 0 a 100.
- Los efectos se aplican al elegir una opción y, si el nodo define `onEnter`, al entrar en él.
- Si la vida llega a cero o menos, el motor cambia a `final_muerte`.
- Si la cordura llega a cero o menos, el motor cambia a `final_locura`. La comprobación de vida se realiza primero.
- Los objetos se guardan en un conjunto (`Set`), evitando duplicados. El motor actual no implementa quitar objetos.
- Una opción con `requires` solo se muestra si el inventario contiene todos los objetos indicados.
- Una opción con `hideIf` se oculta cuando el inventario contiene todos los objetos indicados.
- En un final, las opciones de la historia se reemplazan por el botón para empezar de nuevo. Reiniciar restaura recursos, inventario y nodo inicial.
- Las teclas numéricas del 1 al 9 activan una de las opciones visibles.

## 6. Arquitectura y responsabilidades

El código está organizado en módulos pequeños:

- `public/index.html`: estructura de la consola, región narrativa, estado, inventario y área de opciones. Carga la hoja de estilos y el punto de entrada JavaScript.
- `public/main.mjs`: inicializa el control CRT, registra el atajo de teclado, carga la historia e inicia el motor.
- `public/story.mjs`: obtiene `story.json` mediante `fetch`; informa los errores en la consola y muestra un mensaje en pantalla si la carga falla.
- `public/state.mjs`: define el estado de la partida y las operaciones para aplicar efectos, comprobar objetos y reiniciar.
- `public/engine.mjs`: coordina el estado, el nodo actual, las transiciones, las condiciones de muerte/locura y el renderizado.
- `public/render.mjs`: actualiza vida, cordura, inventario, texto de escenas, finales y botones de decisión.
- `public/items.mjs`: asocia identificadores de objetos con sus nombres en pantalla.
- `public/story.json`: contenido narrativo, opciones, requisitos y consecuencias.
- `public/style.css`: diseño visual adaptable, consola oscura, estética de documento de campo, controles y efecto CRT.
- `server.js`: configura Express para analizar JSON y servir los archivos estáticos desde `public/`; el puerto se puede fijar con `PORT`.
- `package.json` y `package-lock.json`: definen el proyecto Node.js como ES Modules, el comando de inicio y sus dependencias.
- `README.md`: contiene requisitos e instrucciones de instalación y ejecución.

El flujo principal previsto es: cargar `index.html` → ejecutar `main.mjs` → obtener `story.json` → inicializar estado/motor → mostrar el nodo actual → aplicar efectos y renderizar al elegir una opción.

## 7. Tecnologías y dependencias

- HTML y CSS.
- JavaScript con módulos ES, ejecutado en el navegador.
- Node.js con `"type": "module"` y Express para el servidor HTTP.
- `fetch` para cargar los datos de historia.
- `localStorage` para recordar la preferencia CRT.
- Fuente IBM Plex Mono enlazada desde Google Fonts; si no está disponible, se usa una fuente monoespaciada local.
- Express está declarado como dependencia de producción en `package.json`.

No se encontró configuración de compilación, suite de pruebas automatizadas, backend de juego, cuenta de usuario, persistencia de partidas ni integración de base de datos.

## 8. Estado técnico y discrepancias importantes

Los archivos del frontend viven en `public/`; `index.html` carga `./main.mjs` y `story.mjs` carga `./story.json`. Express sirve esa carpeta y analiza cuerpos JSON. La aplicación puede iniciarse con `npm install` y `npm start`; el puerto predeterminado es 3000 y se puede cambiar mediante `PORT`. Para que `fetch` funcione, se debe acceder a través del servidor HTTP, no abrir `index.html` como archivo local.

## 9. Accesibilidad e interfaz

La página incluye etiquetas de región y grupo, atributos de estado accesible (`role`, `aria-label`, `aria-live`) y controles HTML nativos. Las decisiones también se pueden activar con el teclado numérico. El diseño ofrece ajustes de espaciado para pantallas estrechas y limita el ancho de la consola.

La tipografía externa y varios elementos visuales dependen de CSS; el contenido esencial se representa como texto normal en el DOM. El efecto CRT se puede apagar mediante el control de la cabecera.

## 10. Cómo orientar cambios futuros

Para ampliar o mantener el proyecto:

1. Añadir o revisar escenas y decisiones en `story.json`, manteniendo identificadores consistentes y `next` apuntando a nodos existentes.
2. Expresar consecuencias con `fx` y costes de entrada con `onEnter`, respetando los campos que consume `state.mjs`.
3. Registrar cualquier objeto nuevo en `items.mjs` y usar el mismo identificador en el JSON.
4. Mantener la separación entre contenido (`story.json`), reglas (`state.mjs` y `engine.mjs`) y presentación (`render.mjs`, `index.html`, `style.css`).
5. Mantener coherentes los recursos públicos en `public/`, sus rutas relativas y las dependencias declaradas en `package.json`.

## 11. Glosario breve

- **Nodo**: una escena identificada por una clave en `story.json`.
- **Efecto (`fx`)**: cambio de recursos u objetos provocado por una decisión.
- **Efecto de entrada (`onEnter`)**: cambio aplicado al llegar a un nodo.
- **Estado**: vida, cordura, inventario y nodo actual de la partida.
- **Final dinámico**: destino de muerte o locura que el motor selecciona al comprobar los recursos, aunque no sea un destino de decisión directa en el JSON.
- **Runaterra / Demacia**: nombres de la ambientación ficticia mencionada por el texto narrativo del proyecto.
