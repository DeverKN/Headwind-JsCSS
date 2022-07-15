import { AttributeType } from "./HeadwindAttributes"

const headwindAnimations = new Map()

export const addHeadwindAnimations = (animationsObj) => {
  for (const [animationName, value] of Object.entries(animationsObj)) {
    headwindAnimations.set(animationName, value)
  }
}

export const convertBasicAnimationObject = (basicAnimationsObject) => {
  const animationsObject = {}
  for (const [animationName, {value, animation}] of Object.entries(basicAnimationsObject)) {
    animationsObject[animationName] = () => {
      return {
              value, 
              animation, 
              type: AttributeType.ANIMATION
            }
    }
  }
  return animationsObject
}

export const handleAnimation = (animationName, ...values) => {
  console.log({animationName, values})
  const animationResult = headwindAnimations.get(animationName)(...values)
  console.log({animationResult, animationName})
  return animationResult
}