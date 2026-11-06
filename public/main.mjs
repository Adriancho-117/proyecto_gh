import { loadStories } from './story.mjs';
import { renderMenu, renderNode, getChoiceButtons } from './render.mjs';
import { createActState, getAvailableChoices, selectChoice } from './engine.mjs';

const crtToggle = document.getElementById('crtToggle');
const stageEl = document.getElementById('stage');
const choicesEl = document.getElementById('choices');
const ACT1_COMPLETE_KEY = 'jhin-act-1-complete';
let stories;
let currentAct;
let currentState;

function setCrt(enabled) {
  document.body.classList.toggle('crt-disabled', !enabled);
  crtToggle.setAttribute('aria-pressed', String(enabled));
  crtToggle.textContent = enabled ? 'CRT: activo' : 'CRT: desactivado';
  localStorage.setItem('crt-enabled', String(enabled));
}

const savedCrtSetting = localStorage.getItem('crt-enabled');
setCrt(savedCrtSetting !== 'false');

crtToggle.addEventListener('click', () => {
  setCrt(document.body.classList.contains('crt-disabled'));
});


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
  renderNode(visibleNode, choice => showNode(selectChoice(choice, currentState)), showMenu, id);
}

async function start() {
  try {
    stories = await loadStories();
    showMenu();
  } catch (error) {
    console.error('No se pudo cargar la historia:', error);
    const h2 = document.createElement('h2');
    h2.textContent = 'Error';
    const p = document.createElement('p');
    p.textContent = 'No se pudo cargar la historia. Verifica tu conexión o recarga la página.';
    stageEl.innerHTML = '';
    stageEl.appendChild(h2);
    stageEl.appendChild(p);
    choicesEl.innerHTML = '';
  }
}

start();
