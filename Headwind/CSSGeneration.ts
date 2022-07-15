import {
  AttributeType,
  handleHeadwindAttr,
  HeadwindAnimationAttribute,
} from './HeadwindAttributes';
import { handleModifier, CSSModifierType } from './HeadwindModifiers';
import { createAnimation } from './Headwind';

export const generateCSSRuleFromClassName = (className) => {
  return parsedClassNameToCSS(parseClassName(className));
};

export const sanitizeClassName = (baseClassName: string) => {
  console.log('sanitize');
  //Replace spaces inside of parentheses
  const spaceInParenthesesRegex = /( (?=[^(]*\)))/g;
  const classWithSpaces = baseClassName;
  const classWithoutSpaces = classWithSpaces.replaceAll(
    spaceInParenthesesRegex,
    '_'
  );
  let sanitizedClassName = classWithoutSpaces;
  const charsToEscape = ['@', ':', '(', ')'];
  for (const escapeChar of charsToEscape) {
    sanitizedClassName = sanitizedClassName.replaceAll(
      escapeChar,
      `\\${escapeChar}`
    );
  }
  console.log({ classWithSpaces, classWithoutSpaces, sanitizedClassName });
  return {classWithoutSpaces, sanitizedClassName};
};

export const parseClassName = (baseClassName: string) => {
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
  const attributes = [];
  if (classNameToParse.includes('('))
    classNameToParse = classNameToParse.slice(1, -1);
  classNameToParse.split(' ').forEach((attr) => {
    const [token, ...values] = attr.split('-');
    attributes.push({
      token,
      values: values ?? [],
    });
  });
  console.log({ attributes });
  const {sanitizedClassName, classWithoutSpaces} = sanitizeClassName(baseClassName)
  return {
    sanitizedClassName,
    classWithoutSpaces,
    baseClassName,
    modifiers,
    attributes,
  };
};

export const parsedClassNameToCSS = (parsedClassName) => {
  const { sanitizedClassName, classWithoutSpaces, modifiers, attributes } = parsedClassName;
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
  let fallthroughs = [];
  let styles = [];
  attributes.forEach(({ token, values }) => {
    const style = handleHeadwindAttr(token, values);
    if (style.type === AttributeType.FALLTHROUGH) {
      fallthroughs.push([token, ...values].join('-'));
      return;
    }
    if (style.type === AttributeType.ANIMATION) {
      const animationStyle = style as HeadwindAnimationAttribute;
      createAnimation(animationStyle.animation);
    }
    styles.push(style.value);
  });
  return {
    sanitizedClassName,
    classWithoutSpaces,
    ruleString: createCSSString(selector, styles, false, atRules),
    fallthroughs,
  };
};

export const createCSSString = (selector, styles, important, atRules) => {
  let cssString = `${selector} { ${styles.join(
    `${important ? '!important' : ''};\n`
  )} }`;
  if (atRules) {
    for (const atRule of atRules) {
      cssString = `@${atRule} { ${cssString} }`;
    }
  }
  console.log({ cssString });
  return cssString;
};
