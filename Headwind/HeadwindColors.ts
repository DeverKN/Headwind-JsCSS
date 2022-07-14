import { baseColors, baseAttrs } from './BaseHeadwindAttributes';

const headWindColors = new Map();

export const getHeadwindColor = (colorName) => {
  if (headWindColors.has(colorName)) return headWindColors.get(colorName);
  return colorName;
};

export { getHeadwindColor as color };

export const addHeadwindColor = (colorName, colorCode) => {
  headWindColors.set(colorName, colorCode);
};

export const addHeadwindColors = (colorsObj) => {
  if (colorsObj) {
    for (const [colorName, colorCode] of Object.entries(colorsObj)) {
      addHeadwindColor(colorName, colorCode);
    }
  }
};