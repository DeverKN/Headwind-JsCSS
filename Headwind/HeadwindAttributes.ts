const headwindAttrHandlers = new Map();

export const addHeadwindAttributeHandler = (attr, handler) => {
  headwindAttrHandlers.set(attr, handler);
};

export const addHeadwindAttributeHandlers = (handlersObject) => {
  for (const [attr, handler] of Object.entries(handlersObject)) {
    headwindAttrHandlers.set(attr, handler);
  }
};

export const handleHeadwindAttr = (token, value) => {
  if (headwindAttrHandlers.has(token)) {
    return headwindAttrHandlers.get(token)(value);
  } else {
    return null
    // throw TypeError(`HwJS: Unknown CSS attribute ${token}`);
  }
};