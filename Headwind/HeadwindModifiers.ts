const headwindModifiers = new Map<string, CSSModifierHandler>();

export enum CSSModifierType {
  PSEUDO_SELECTOR,
  PSEUDO_CLASS,
  AT_RULE,
}

type CSSModifier = {
  rule: string;
  type: CSSModifierType;
};

type CSSModifierHandler = (value: string) => CSSModifier;

export const addHeadwindModifier = (
  modifierToken: string,
  handler: CSSModifierHandler
) => {
  headwindModifiers.set(modifierToken, handler);
};

type HeadwindModifierObject = {
  [key: string]: CSSModifierHandler
}

export const addHeadwindModifiers = (
  modifierObject: HeadwindModifierObject
) => {
  for (const [modifierToken, handler] of Object.entries(modifierObject)) {
    addHeadwindModifier(modifierToken, handler);
  }
};

export const handleModifier = (
  modifierString: string,
  value: string,
  doubleColon: boolean
): CSSModifier => {
  console.log({modifierString})
  if (headwindModifiers.has(modifierString)) {
    return headwindModifiers.get(modifierString)(value);
  }
  let type: CSSModifierType;
  if (doubleColon) {
    type = CSSModifierType.PSEUDO_CLASS;
  } else {
    type = CSSModifierType.PSEUDO_SELECTOR;
  }
  return {
    rule: modifierString,
    type,
  };
};
