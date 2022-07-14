import { baseColors, baseAttrs } from './BaseHeadwindAttributes';

const headWindColors = new Map<string, string>();

export const getHeadwindColor = (colorName: string): string => {
  if (headWindColors.has(colorName)) return headWindColors.get(colorName);
  return colorName;
};

export { getHeadwindColor as color };

export const addHeadwindColor = (colorName: string, colorCode: string) => {
  headWindColors.set(colorName, colorCode);
};

type HeadwindColorsObject = {
  [key: string]: string
}

export const addHeadwindColors = (colorsObj: HeadwindColorsObject) => {
  for (const [colorName, colorCode] of Object.entries(colorsObj)) {
    addHeadwindColor(colorName, colorCode);
  }
};