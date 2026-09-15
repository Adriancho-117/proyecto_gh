
export const state = {
  hp: 100,
  sanity: 100,
  inventory: new Set(),
  currentId: "inicio"
};


export function clamp(n) {
  return Math.max(0, Math.min(100, n));
}


export function applyEffects(fx) {
  if (!fx) return;
  if (fx.hp)      state.hp = clamp(state.hp + fx.hp);
  if (fx.sanity)  state.sanity = clamp(state.sanity + fx.sanity);
  if (fx.addItem) state.inventory.add(fx.addItem);
}


export function hasAll(items) {
  if (!items) return true;
  return items.every(i => state.inventory.has(i));
}


export function resetState() {
  state.hp = 100;
  state.sanity = 100;
  state.inventory = new Set();
  state.currentId = "inicio";
}
