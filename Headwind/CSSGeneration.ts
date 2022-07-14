import { handleHeadwindAttr } from './HeadwindAttributes';

export const generateCSSRuleFromClassName = (className) => {
  return parsedClassNameToCSS(parseClassName(className));
};

export const sanitizeClassName = (baseClassName) => {
  let santizedClassName = baseClassName;
  const charsToEscape = ['@', ':']
  for (const escapeChar of charsToEscape) {
    santizedClassName = santizedClassName.replaceAll(escapeChar, `\\${escapeChar}`);
  }
  return santizedClassName;
};

export const parseClassName = (baseClassName) => {
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

export const parsedClassNameToCSS = (parsedClassName) => {
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
  const style = handleHeadwindAttr(token, value);
  if (style === null) return {sanitizedClassName, fallThrough: true}
  return {
    sanitizedClassName,
    ruleString: createCSSString(selector, style, false, atRules),
  };
};

export const createCSSString = (selector, style, important, atRules) => {
  let cssString = `${selector} { ${style}${important ? "!important" : ""}; }`
  if (atRules) {
    for (const atRule of atRules) {
      cssString = `@${atRule} { ${cssString} }`
    }
  }
  return cssString
}