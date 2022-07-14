type AttributeHandler = (value: string) => string
type AttributeHandlerObject = {
  [key: string]: AttributeHandler
}

const headwindAttrHandlers = new Map();

export const addHeadwindAttributeHandler = (attr: string, handler: AttributeHandler) => {
  headwindAttrHandlers.set(attr, handler);
};

export const addHeadwindAttributeHandlers = (handlersObject: AttributeHandlerObject) => {
  for (const [attr, handler] of Object.entries(handlersObject)) {
    headwindAttrHandlers.set(attr, handler);
  }
};

export const handleHeadwindAttr = (token: string, value: string) => {
  if (headwindAttrHandlers.has(token)) {
    return headwindAttrHandlers.get(token)(value);
  } else {
    return null
  }
};