import { state, applyEffects, resetState } from './state.mjs';
import { renderNode } from './render.mjs';


let STORY = null;

export function initEngine(storyData) {
  STORY = storyData;
}


export function goTo(nodeId, effects) {
  applyEffects(effects);

  const node = STORY[nodeId];
  if (node && node.onEnter) applyEffects(node.onEnter);

  if (state.hp <= 0 && nodeId !== 'final_muerte') {
    state.currentId = 'final_muerte';
  } else if (state.sanity <= 0 && nodeId !== 'final_locura') {
    state.currentId = 'final_locura';
  } else {
    state.currentId = nodeId;
  }

  render();
}


export function render() {
  renderNode(STORY[state.currentId], goTo, restart);
}


export function restart() {
  resetState();
  render();
}
