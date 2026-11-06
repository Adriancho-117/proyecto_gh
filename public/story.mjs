
async function loadAct(file, number) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${file}: respuesta ${response.status}`);
  }

  const act = await response.json();
  if (act.acto !== number || !Array.isArray(act.nodos) || act.nodos.length === 0) {
    throw new Error(`El archivo ${file} no contiene el acto ${number} en el formato esperado.`);
  }

  const nodeIds = new Set(act.nodos.map(node => node.id));
  for (const node of act.nodos) {
    if (!node.id || !node.titulo || typeof node.narrativa !== 'string' || !Array.isArray(node.opciones) ||
        node.opciones.some(choice => !choice.texto || !nodeIds.has(choice.siguiente_nodo))) {
      throw new Error(`El nodo "${node.id}" en ${file} tiene datos u opciones inválidos.`);
    }
  }

  return {
    title: act.titulo_general,
    name: act.nombre_acto,
    description: act.descripcion_acto,
    startId: act.nodos[0].id,
    nodes: Object.fromEntries(act.nodos.map(node => [node.id, {
      title: node.titulo,
      text: node.narrativa,
      choices: node.opciones.map(choice => ({
        label: choice.texto,
        next: choice.siguiente_nodo
      })),
      isEnding: node.opciones.length === 0
    }]))
  };
}

export async function loadStories() {
  const [act1, act2] = await Promise.all([
    loadAct('./acto-1-caceria-jhin.json', 1),
    loadAct('./acto-2-caceria-jhin.json', 2)
  ]);

  if (act1.title !== act2.title) {
    throw new Error('Los actos cargados no pertenecen a la misma historia.');
  }

  return { title: act1.title, act1, act2 };
}
