import { baseAttrs, baseColors, baseModifiers } from './BaseHeadwindAttributes';
import { addHeadwindAttributeHandlers } from './HeadwindAttributes';
import { addHeadwindModifiers } from './HeadwindModifiers';
import { addHeadwindColors } from './HeadwindColors';
import { createDevTools } from './HeadwindDevTools';
import { generateCSSRuleFromClassName } from './CSSGeneration';

addHeadwindAttributeHandlers(baseAttrs);
addHeadwindColors(baseColors);
addHeadwindModifiers(baseModifiers);

const hwStyleSheet = new CSSStyleSheet();
const existingClassNames = new Set();

createDevTools(hwStyleSheet, existingClassNames);

export const hw = (className) => {
  const classNames = className.split(' ');
  const mappedClassNames = classNames.map(handleClassName).join(' ');
  return mappedClassNames;
};

const handleClassName = (className) => {
  if (!existingClassNames.has(className)) {
    console.log(`Cache miss for ${className}`);
    const { sanitizedClassName, ruleString, fallThrough } =
      generateCSSRuleFromClassName(className);
    if (fallThrough) {
      console.log(`Fall-through class: ${className}`);
    } else {
      hwStyleSheet.insertRule(ruleString);
    }
    existingClassNames.add(className);
  }
  return className;
};
