import { ITEMS } from './items.mjs';
import { state, hasAll } from './state.mjs';

const stageEl   = document.getElementById('stage');
const choicesEl = document.getElementById('choices');
const nodeTagEl = document.getElementById('nodeTag');


function barString(value, glyphFull, glyphEmpty) {
  const total = 20;
  const filled = Math.round((value / 100) * total);
  return glyphFull.repeat(filled) + glyphEmpty.repeat(total - filled);
}


export function renderStatus() {
  document.getElementById('hpBar').textContent = barString(state.hp, '█', '░');
  document.getElementById('hpNum').textContent = state.hp + '/100';
  document.getElementById('hpRow').setAttribute('aria-label', 'Vida: ' + state.hp + ' de 100');

  document.getElementById('sanBar').textContent = barString(state.sanity, '▓', '░');
  document.getElementById('sanNum').textContent = state.sanity + '/100';
  document.getElementById('sanRow').setAttribute('aria-label', 'Cordura: ' + state.sanity + ' de 100');

  const inv = document.getElementById('inventory');
  inv.innerHTML = '';
  if (state.inventory.size === 0) {
    const span = document.createElement('span');
    span.className = 'empty';
    span.textContent = 'sin objetos';
    inv.appendChild(span);
  } else {
    state.inventory.forEach(key => {
      const span = document.createElement('span');
      span.className = 'item';
      span.textContent = ITEMS[key];
      inv.appendChild(span);
    });
  }
}


export function renderNode(node, onChoice, onRestart) {
  renderStatus();
  nodeTagEl.textContent = state.currentId;

  stageEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.textContent = node.title;
  stageEl.appendChild(h2);

  if (node.isEnding) {
    const tag = document.createElement('span');
    tag.className = 'ending-tag' + (node.good ? ' good' : '');
    tag.textContent = node.tag;
    stageEl.appendChild(tag);
  }

  node.text.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    stageEl.appendChild(p);
  });

  stageEl.scrollTop = 0;

  choicesEl.innerHTML = '';

  if (node.isEnding) {
    const btn = document.createElement('button');
    btn.className = 'restart-btn';
    btn.textContent = '↺ empezar de nuevo';
    btn.onclick = onRestart;
    choicesEl.appendChild(btn);
    return;
  }

  (node.choices || []).forEach((choice, i) => {
    if (choice.hideIf && hasAll(choice.hideIf)) return;
    if (choice.requires && !hasAll(choice.requires)) return;

    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    const idx = document.createElement('span');
    idx.className = 'idx';
    idx.textContent = '[' + (i + 1) + ']';
    const label = document.createElement('span');
    label.textContent = choice.label;
    btn.appendChild(idx);
    btn.appendChild(label);
    btn.onclick = () => onChoice(choice.next, choice.fx);
    choicesEl.appendChild(btn);
  });
}

export function getChoiceButtons() {
  return choicesEl.querySelectorAll('.choice-btn');
}
