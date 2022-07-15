import { hw } from './Headwind';

export const styleNode = (node: HTMLElement) => {
  if (node?.dataset?.hw) node.className = (node.className ?? " ") + " " + hw(node.dataset.hw);
};

export const styleAllNodes = (node: HTMLElement) => {
  styleNode(node);
  node.childNodes.forEach(styleAllNodes);
};

export const stringifyStyleSheet = (styleSheet: CSSStyleSheet) => {
  const rules = Array.from(styleSheet.cssRules);
  return rules.reduce((prev, current) => prev + '\n' + current.cssText, '');
};

export const createStyleTagFromString = (styles: string) => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  return styleTag;
};