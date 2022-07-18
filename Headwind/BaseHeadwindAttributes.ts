import { color } from './HeadwindColors';
import { CSSModifierType } from './HeadwindModifiers';
import { AttributeType } from './HeadwindAttributes';
import { handleAnimation } from './HeadwindAnimations';

export const baseAnimations = {
  bounce: {
    value: `animation: bounce 1s infinite;`,
    animation: `@keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }`
  },
  ping: {
    value: `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;`,
    animation: `@keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }`
  }
}

export const pureHandler = (value: string, type: Number) => {
  return () => {
    return {
      value,
      type
    }
  }
}

export const pureAttr = (value: string) => {
  return pureHandler(value, AttributeType.CSS_ATTRIBUTE)
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
  flex: pureAttr(`display: flex`),
  font: pureAttr(`font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;`),
  animate: (animationName, ...values) => handleAnimation(animationName, ...values)
};

export const baseColors = {
  sexypink: `#ff69b4`,
};

export const pureModifier = (value: string) => {
  return pureHandler(value, CSSModifierType.AT_RULE)
}

export const baseModifiers = {
  nightmode: pureModifier(`media (prefers-color-scheme: dark)`)
}