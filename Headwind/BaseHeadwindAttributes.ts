import { color } from './HeadwindColors';

export const baseAttrs = {
  bg: (value) => `background-color: ${color(value)}`,
  color: (value) => `color: ${color(value)}`,
  flex: () => `display: flex`,
};

export const baseColors = {
  sexypink: `#ff69b4`,
};

export const baseModifiers = {
  nightmode: () => `media (prefers-color-scheme: dark)`
}