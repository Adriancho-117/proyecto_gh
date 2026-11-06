
const STORY_TITLE = 'La Cacería del Demonio Dorado';

async function loadAct(file) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${file}: respuesta ${response.status}`);
  }

  const act = await response.json();
  if (!act.variables_iniciales || typeof act.variables_iniciales !== 'object' ||
      Array.isArray(act.variables_iniciales) || !Array.isArray(act.nodos) || act.nodos.length === 0) {
    throw new Error(`El archivo ${file} no contiene datos de acto en el formato esperado.`);
  }

  const nodeIds = new Set(act.nodos.map(node => node.id));
  for (const node of act.nodos) {
    if (!node.id || !node.titulo || typeof node.narrativa !== 'string' ||
        typeof node.nodo_final !== 'boolean' || !Array.isArray(node.opciones) ||
        node.opciones.some(choice => !choice.texto || !nodeIds.has(choice.siguiente_nodo) ||
          !choice.efectos || typeof choice.efectos !== 'object' || Array.isArray(choice.efectos) ||
          (choice.condicion !== null && typeof choice.condicion !== 'string'))) {
      throw new Error(`El nodo "${node.id}" en ${file} tiene datos u opciones inválidos.`);
    }
  }

  return {
    name: act.nodos[0].titulo,
    initialVariables: act.variables_iniciales,
    startId: act.nodos[0].id,
    nodes: Object.fromEntries(act.nodos.map(node => [node.id, {
      title: node.titulo,
      text: node.narrativa,
      choices: node.opciones.map(choice => ({
        label: choice.texto,
        next: choice.siguiente_nodo,
        effects: choice.efectos,
        condition: choice.condicion
      })),
      isEnding: node.nodo_final
    }]))
  };
}

export async function loadStories() {
  const [act1, act2] = await Promise.all([
    loadAct('./jhin_acto_1_sombras_de_zhyun%20.json'),
    loadAct('./acto-2-caceria-jhin.json')
  ]);

  return { title: STORY_TITLE, act1, act2 };
}
