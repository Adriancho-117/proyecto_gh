const stage = document.getElementById('stage');
const choices = document.getElementById('choices');

function addButton(label, action, index = '›', className = 'choice-btn') {
  const button = document.createElement('button');
  button.className = className === 'restart-btn'
    ? 'btn btn-outline-secondary restart-btn'
    : 'btn btn-outline-warning choice-btn';
  button.type = 'button';

  const marker = document.createElement('span');
  marker.className = 'idx';
  marker.textContent = index;
  button.appendChild(marker);

  const text = document.createElement('span');
  text.textContent = label;
  button.appendChild(text);
  button.onclick = action;
  choices.appendChild(button);
}

export function renderNode(node, onChoice, onMenu) {
  stage.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.textContent = node.title;
  stage.appendChild(h2);

  if (node.isEnding) {
    const tag = document.createElement('span');
    tag.className = 'ending-tag';
    tag.textContent = 'Final';
    stage.appendChild(tag);
  }

  const paragraph = document.createElement('p');
  paragraph.textContent = node.text;
  stage.appendChild(paragraph);
  stage.scrollTop = 0;
  choices.innerHTML = '';
  if (node.isEnding) {
    addButton('Volver al menú principal', onMenu, '↺', 'restart-btn');
    return;
  }

  node.choices.forEach((choice, index) => {
    addButton(choice.label, () => onChoice(choice), `[${index + 1}]`);
  });
}

export function renderMenu(stories, act2Unlocked, onStartAct) {
  stage.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.className = 'menu-title';
  h2.textContent = stories.title;
  stage.appendChild(h2);

  const intro = document.createElement('p');
  intro.className = 'menu-intro';
  intro.textContent = 'Una historia interactiva de decisiones, sombras y cacería en Jonia.';
  stage.appendChild(intro);
  stage.scrollTop = 0;
  choices.innerHTML = '';
  addButton(`${stories.act1.name} — Comenzar historia`, () => onStartAct(1));

  if (act2Unlocked) {
    addButton(`${stories.act2.name} — Continuar historia`, () => onStartAct(2));
  } else {
    const hint = document.createElement('p');
    hint.className = 'menu-hint';
    hint.textContent = 'Completa el acto disponible para descubrir lo que sigue.';
    choices.appendChild(hint);
  }
}

export function getChoiceButtons() {
  return choices.querySelectorAll('.choice-btn');
}
