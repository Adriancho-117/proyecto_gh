export function createState(initialVariables) {
  return { ...initialVariables };
}

export function applyEffects(state, effects) {
  for (const [key, value] of Object.entries(effects)) {
    if (typeof value === 'number') {
      const currentValue = state[key] ?? 0;
      if (typeof currentValue !== 'number') {
        throw new Error(`La variable "${key}" debe ser numérica para aplicar sus efectos.`);
      }
      state[key] = currentValue + value;
    } else {
      state[key] = value;
    }
  }
}

export function conditionMatches(condition, state) {
  if (condition === null) return true;

  const match = condition.match(
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*(>=|<=|===|!==|==|!=|>|<)\s*(-?(?:\d+(?:\.\d*)?|\.\d+)|"([^"]*)"|'([^']*)'|([A-Za-z_][A-Za-z0-9_-]*))\s*$/
  );
  if (!match) {
    throw new Error(`La condición "${condition}" no tiene un formato válido.`);
  }

  const [, key, operator, rawValue, doubleQuotedValue, singleQuotedValue, bareValue] = match;
  const expectedValue = doubleQuotedValue ?? singleQuotedValue ?? bareValue ??
    (rawValue === undefined ? undefined : Number(rawValue));
  const actualValue = state[key];

  if (actualValue === undefined) {
    throw new Error(`La condición utiliza la variable no definida "${key}".`);
  }

  switch (operator) {
    case '>':
      return actualValue > expectedValue;
    case '>=':
      return actualValue >= expectedValue;
    case '<':
      return actualValue < expectedValue;
    case '<=':
      return actualValue <= expectedValue;
    case '==':
    case '===':
      return actualValue === expectedValue;
    case '!=':
    case '!==':
      return actualValue !== expectedValue;
  }
}
