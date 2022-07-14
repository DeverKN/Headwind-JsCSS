type AttributeHandler = (
  value: string
) => HeadwindAttribute;
type AttributeHandlerObject = {
  [key: string]: AttributeHandler;
};

export enum AttributeType {
  CSS_ATTRIBUTE,
  ANIMATION,
  FALLTHROUGH,
}

export type HeadwindCSSAttribute = {
  value: string;
  type: AttributeType;
};

export type HeadwindAnimationAttribute = {
  value: string;
  animation: string;
  type: AttributeType.ANIMATION;
};

export type HeadwindAttribute = HeadwindCSSAttribute | HeadwindAnimationAttribute

const headwindAttrHandlers = new Map();

export const addHeadwindAttributeHandler = (
  attr: string,
  handler: AttributeHandler
) => {
  headwindAttrHandlers.set(attr, handler);
};

export const addHeadwindAttributeHandlers = (
  handlersObject: AttributeHandlerObject
) => {
  for (const [attr, handler] of Object.entries(handlersObject)) {
    headwindAttrHandlers.set(attr, handler);
  }
};

export const handleHeadwindAttr = (
  token: string,
  value: string
): HeadwindAttribute => {
  if (headwindAttrHandlers.has(token)) {
    return headwindAttrHandlers.get(token)(value);
  } else {
    return { value: '', type: AttributeType.FALLTHROUGH };
  }
};
