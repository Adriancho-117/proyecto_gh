import { applyEffects, conditionMatches, createState } from './state.mjs';

export function createActState(act) {
  return createState(act.initialVariables);
}

export function getAvailableChoices(node, state) {
  return node.choices.filter(choice => conditionMatches(choice.condition, state));
}

export function selectChoice(choice, state) {
  applyEffects(state, choice.effects);
  return choice.next;
}
