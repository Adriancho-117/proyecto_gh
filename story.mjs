
export async function loadStory() {
  try {
    const response = await fetch('./js/story.json');
    if (!response.ok) {
      throw new Error('Respuesta no válida del servidor: ' + response.status);
    }
    return await response.json();
  } catch (err) {
    console.error('No se pudo cargar story.json:', err);
    return null;
  }
}
