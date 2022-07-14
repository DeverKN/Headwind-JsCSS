import { color } from './HeadwindColors';
import { CSSModifierType } from './HeadwindModifiers';
import { AttributeType } from './HeadwindAttributes';

const baseHeadwindAnimations = (value) => {
  if (value === 'ping') {
    return {
        value: `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;`,
        animation: `@keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }`,
        type: AttributeType.ANIMATION
      }

  }
}

export const baseAttrs = {
  bg: (value) => {
    return {
      value: `background-color: ${color(value)}`,
      type: AttributeType.CSS_ATTRIBUTE
    }
  },
  color: (value) => {
    return {
      value: `color: ${color(value)}`,
      type: AttributeType.CSS_ATTRIBUTE
    }
  },
  flex: () => {
    return {
      value: `display: flex`,
      type: AttributeType.CSS_ATTRIBUTE
    }
  },
  animate: baseHeadwindAnimations
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