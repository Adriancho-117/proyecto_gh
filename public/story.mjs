
import { fetchAct } from './script.js';

const STORY_TITLE = 'La Cacería del Demonio Dorado';

async function loadAct(actId) {
  const file = `/api/actos/${actId}`;
  const act = await fetchAct(actId);
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
    loadAct(1),
    loadAct(2)
  ]);

  return { title: STORY_TITLE, act1, act2 };
}
