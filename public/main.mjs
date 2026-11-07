import { loadStories } from './story.mjs';
import { renderMenu, renderNode, getChoiceButtons } from './render.mjs';
import { createActState, getAvailableChoices, selectChoice } from './engine.mjs';

const stageEl = document.getElementById('stage');
const choicesEl = document.getElementById('choices');
const ACT1_COMPLETE_KEY = 'jhin-act-1-complete';
let stories;
let currentAct;
let currentState;

document.addEventListener('keydown', (e) => {
  if (/^[1-9]$/.test(e.key)) {
    const btns = getChoiceButtons();
    btns[Number(e.key) - 1]?.click();
  }
});

function showMenu() {
  renderMenu(
    stories,
    localStorage.getItem(ACT1_COMPLETE_KEY) === 'true',
    startAct
  );
}

function startAct(number) {
  if (number === 2 && localStorage.getItem(ACT1_COMPLETE_KEY) !== 'true') {
    showMenu();
    return;
  }

  currentAct = number === 1 ? stories.act1 : stories.act2;
  currentState = createActState(currentAct);
  showNode(currentAct.startId);
}

function showNode(id) {
  const node = currentAct.nodes[id];
  if (!node) throw new Error(`No existe el nodo "${id}".`);
  if (currentAct === stories.act1 && node.isEnding) {
    localStorage.setItem(ACT1_COMPLETE_KEY, 'true');
  }
  const visibleNode = { ...node, choices: getAvailableChoices(node, currentState) };
  renderNode(visibleNode, choice => showNode(selectChoice(choice, currentState)), showMenu);
}

async function start() {
  try {
    stories = await loadStories();
    stageEl.setAttribute('aria-busy', 'false');
    showMenu();
  } catch (error) {
    console.error('No se pudo cargar la historia:', error);
    stageEl.innerHTML = '';
    stageEl.setAttribute('aria-busy', 'false');
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger feedback-message mb-0';
    alert.setAttribute('role', 'alert');
    alert.textContent = 'No se pudo cargar la historia. Verifica tu conexión o recarga la página.';
    stageEl.appendChild(alert);
    choicesEl.innerHTML = '';
  }
}

start();
