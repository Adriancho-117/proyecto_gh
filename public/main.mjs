import { loadStory } from './story.mjs';
import { initEngine, render } from './engine.mjs';
import { getChoiceButtons } from './render.mjs';

const crtToggle = document.getElementById('crtToggle');

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
  const n = parseInt(e.key);
  if (!isNaN(n) && n >= 1 && n <= 9) {
    const btns = getChoiceButtons();
    if (btns[n - 1]) btns[n - 1].click();
  }
});


async function start() {
  const storyData = await loadStory();

  if (!storyData) {
    const stageEl = document.getElementById('stage');
    stageEl.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Error';
    const p = document.createElement('p');
    p.textContent = 'No se pudo cargar la historia. Verifica tu conexión o recarga la página.';
    stageEl.appendChild(h2);
    stageEl.appendChild(p);
    return;
  }

  initEngine(storyData);
  render();
}

start();
