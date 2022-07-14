import {
  AttributeType,
  handleHeadwindAttr,
  HeadwindAnimationAttribute,
} from './HeadwindAttributes';
import { handleModifier, CSSModifierType } from './HeadwindModifiers';
import { createAnimation } from './Headwind'

export const generateCSSRuleFromClassName = (className) => {
  return parsedClassNameToCSS(parseClassName(className));
};

const createAnimation = () => {};

export const sanitizeClassName = (baseClassName) => {
  let santizedClassName = baseClassName;
  const charsToEscape = ['@', ':'];
  for (const escapeChar of charsToEscape) {
    santizedClassName = santizedClassName.replaceAll(
      escapeChar,
      `\\${escapeChar}`
    );
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
      const ruleString = res.slice(1, doubleColon ? -2 : -1);
      return handleModifier(ruleString, '', doubleColon);
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
  let atRules = [];
  if (modifiers.length > 0) {
    const modifiersText = modifiers.reduce((prev, { rule, type }) => {
      if (type === CSSModifierType.PSEUDO_CLASS) return `${prev}::${rule}`;
      if (type === CSSModifierType.PSEUDO_SELECTOR) return `${prev}:${rule}`;
      if (type === CSSModifierType.AT_RULE) {
        atRules.push(rule);
        return '';
      }
    }, '');
    selector = `.${sanitizedClassName}${modifiersText}`;
  } else {
    selector = `.${sanitizedClassName}`;
  }
  const style = handleHeadwindAttr(token, value);
  if (style.type === AttributeType.FALLTHROUGH)
    return { sanitizedClassName, fallThrough: true };
  if (style.type === AttributeType.ANIMATION) {
    const animationStyle = style as HeadwindAnimationAttribute;
    createAnimation(animationStyle.animation);
  }
  return {
    sanitizedClassName,
    ruleString: createCSSString(selector, style.value, false, atRules),
  };
};

export const createCSSString = (selector, style, important, atRules) => {
  let cssString = `${selector} { ${style}${important ? '!important' : ''}; }`;
  if (atRules) {
    for (const atRule of atRules) {
      cssString = `@${atRule} { ${cssString} }`;
    }
  }
  console.log({ cssString });
  return cssString;
};
