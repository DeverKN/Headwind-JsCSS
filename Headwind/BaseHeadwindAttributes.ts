import { color } from './HeadwindColors';
import { CSSModifierType } from './HeadwindModifiers';


export const baseAttrs = {
  bg: (value) => `background-color: ${color(value)}`,
  color: (value) => `color: ${color(value)}`,
  flex: () => `display: flex`,
};

export const baseColors = {
  sexypink: `#ff69b4`,
};

export const baseModifiers = {
  nightmode: () => {
    return {
      rule: `media (prefers-color-scheme: dark)`,
      type: CSSModifierType.AT_RULE
    }
  }
}