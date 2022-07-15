import { baseAttrs, baseColors, baseModifiers, baseAnimations } from './BaseHeadwindAttributes';
import { addHeadwindAttributeHandlers } from './HeadwindAttributes';
import { addHeadwindModifiers } from './HeadwindModifiers';
import { addHeadwindColors } from './HeadwindColors';
import { createDevTools } from './HeadwindDevTools';
import { generateCSSRuleFromClassName } from './CSSGeneration';
import { createStringStyleSheet, StringStyleSheet } from './StringStyleSheet';
import { isStringStyleSheet } from './StringStyleSheet';
import { stringifyStyleSheet } from './HeadwindDom';
import { convertBasicAnimationObject, addHeadwindAnimations } from "./HeadwindAnimations"

addHeadwindAttributeHandlers(baseAttrs);
addHeadwindColors(baseColors);
addHeadwindModifiers(baseModifiers);
addHeadwindAnimations(convertBasicAnimationObject(baseAnimations))

export type StyleSheet = StringStyleSheet | CSSStyleSheet;

const constructedStylesheet = new CSSStyleSheet();
let hwStyleSheet: StyleSheet = constructedStylesheet
const existingClassNames = new Set();
const processedClassNames = new Map();

export const renderToString = () => (hwStyleSheet = createStringStyleSheet());
export const renderToStyleSheet = () => (hwStyleSheet = constructedStylesheet);

const insertRule = (cssRuleString: string) => hwStyleSheet.insertRule(cssRuleString)

createDevTools(hwStyleSheet, existingClassNames);

export const hw = (className) => {
  const attrRegex =
    /((@[A-z]+:)(\((([A-z]+)(-([A-z]+))* ?)+\))|((@[A-z]+:)*)([A-z]+)(-([A-z]+))*)/g;
  const attrRegexResults = className.match(attrRegex);
  const mappedClassNames = attrRegexResults.map(handleClassName).join(' ');
  return mappedClassNames;
};

const handleClassName = (className) => {
  if (!processedClassNames.has(className)) {
    const { sanitizedClassName, classWithoutSpaces, ruleString } =
      generateCSSRuleFromClassName(className);
    insertRule(ruleString);
    processedClassNames.set(className, classWithoutSpaces);
    return classWithoutSpaces;
  }
  return processedClassNames.get(className);
};

export const createAnimation = (animation: string) => insertRule(animation);

export const stringifyHWStyleSheet = () => {
  if (isStringStyleSheet(hwStyleSheet)) return hwStyleSheet.getStyles();
  if (hwStyleSheet instanceof CSSStyleSheet)
    return stringifyStyleSheet(hwStyleSheet);
};
