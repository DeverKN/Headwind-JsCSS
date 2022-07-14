const headwindModifiers = new Map()

export enum CSSModifierType {
  PSEUDO_SELECTOR,
  PSEUDO_CLASS,
  AT_RULE
}

export const addHeadwindModifier = (modifierToken, handler) => {
  headwindModifiers.set(modifierToken, handler)
}

export const handleModifier = (modifierString, value, doubleColon) => {
  if (headwindModifiers.has(modifierString)) {
    return headwindModifiers.get(modifierString)(value)
  }
  let type: CSSModifierType;
  if (doubleColon) {
    type = CSSModifierType.PSEUDO_CLASS
  } else {
    type = CSSModifierType.PSEUDO_SELECTOR
  }
  return {
    modifierString,
    type
  }
}