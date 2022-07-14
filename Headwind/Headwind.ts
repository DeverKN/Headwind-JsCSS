import { baseAttrs, baseColors } from './BaseHeadwindAttributes';
import { addHeadwindColors, color } from './HeadwindColors';

console.log({ baseAttrs, baseColors });

const hwStyleSheet = new CSSStyleSheet();
const existingClassNames = new Set();
// const sanitizedClassNames = new Map();

document['adoptedStyleSheets'] = [
  ...document['adoptedStyleSheets'],
  hwStyleSheet,
];

const HeadwindDevTools = {
  hwStyleSheet,
  existingClassNames,
};

window['HeadwindDevTools'] = HeadwindDevTools;

export const styleElement = (element) => {
  console.log(element.classList);
};

export const hw = (className) => {
  const classNames = className.split(' ');
  const mappedClassNames = classNames.map(handleClassName).join(' ');
  return mappedClassNames
};

const handleClassName = (className) => {
  if (!existingClassNames.has(className)) {
    console.log(`Cache miss for ${className}`)
    const { sanitizedClassName, ruleString, fallThrough } = generateCSSRuleFromClassName(className);
    if (fallThrough) {
      console.log(`Fall-through class: ${className}`)
    } else {
      hwStyleSheet.insertRule(ruleString);
    }
    existingClassNames.add(className);
  }
  return className
};

const generateCSSRuleFromClassName = (className) => {
  return parsedClassNameToCSS(parseClassName(className));
};

const sanitizeClassName = (baseClassName) => {
  let santizedClassName = baseClassName;
  const charsToEscape = ['@', ':']
  for (const escapeChar of charsToEscape) {
    santizedClassName = santizedClassName.replaceAll(escapeChar, `\\${escapeChar}`);
  }
  //santizedClassName = santizedClassName.replaceAll('@', '\\@');
  //santizedClassName = santizedClassName.replaceAll(':', '\\:');
  return santizedClassName;
};

const CSSModifierTypes = {
  PSEUDO_SELECTOR: 0,
  PSEUDO_CLASS: 1,
  AT_RULE: 2
}

const parseClassName = (baseClassName) => {
  let classNameToParse = baseClassName;
  const modifierRegex = /@[A-z0-9]*:{1,2}/g;
  const modifierRegexResults = classNameToParse.match(modifierRegex);
  let modifiers = [];
  if (modifierRegexResults) {
    const modifiersEnd = modifierRegexResults.reduce(
      (prev, res) => prev + res.length,
      0
    );
    const doubleColonModifierRegex = /@[A-z0-9]*::/;
    modifiers = modifierRegexResults.map((res) => {
      const doubleColon = doubleColonModifierRegex.test(res);
      let type;
      if (doubleColon) {
        type = CSSModifierTypes.PSEUDO_CLASS
      } else {
        type = CSSModifierTypes.PSEUDO_SELECTOR
      }
      return {
        rule: res.slice(1, doubleColon ? -2 : -1),
        type
      };
    });
    classNameToParse = classNameToParse.slice(modifiersEnd);
  }
  const [token, value] = classNameToParse.split('-');
  return {
    sanitizedClassName: sanitizeClassName(baseClassName),
    baseClassName,
    modifiers,
    token,
    value: value ?? null,
  };
};

const cssAttrHandlers = new Map();

const addHeadwindAttributeHandler = (attr, handler) => {
  cssAttrHandlers.set(attr, handler);
};

const addHeadwindAttributeHandlers = (handlersObject) => {
  for (const [attr, handler] of Object.entries(handlersObject)) {
    cssAttrHandlers.set(attr, handler);
  }
};

addHeadwindAttributeHandlers(baseAttrs);
addHeadwindColors(baseColors);

const handleCSSAttr = (token, value) => {
  if (cssAttrHandlers.has(token)) {
    return cssAttrHandlers.get(token)(value);
  } else {
    return null
    // throw TypeError(`HwJS: Unknown CSS attribute ${token}`);
  }
};

const createCSSString = (selector, style, important, atRules) => {
  let cssString = `${selector} { ${style}${important ? "!important" : ""}; }`
  if (atRules) {
    for (const atRule of atRules) {
      cssString = `@${atRule} { ${cssString} }`
    }
  }
  return cssString
}

const parsedClassNameToCSS = (parsedClassName) => {
  const { sanitizedClassName, modifiers, token, value } = parsedClassName;
  let selector;
  let atRules;
  if (modifiers.length > 0) {
    const modifiersText = modifiers.reduce((prev, { rule, type }) => {
      if (type === CSSModifierTypes.PSEUDO_CLASS) return `${prev}::${rule}`;
      if (type === CSSModifierTypes.PSEUDO_SELECTOR) return `${prev}:${rule}`;
      if (type === CSSModifierTypes.AT_RULE) atRules.push(rule)
    }, '');
    selector = `.${sanitizedClassName}${modifiersText}`;
  } else {
    selector = `.${sanitizedClassName}`;
  }
  const style = handleCSSAttr(token, value);
  if (style === null) return {sanitizedClassName, fallThrough: true}
  return {
    sanitizedClassName,
    ruleString: createCSSString(selector, style, false, atRules),
  };
};
