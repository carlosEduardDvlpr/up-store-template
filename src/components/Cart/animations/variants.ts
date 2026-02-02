import { Variants } from 'framer-motion'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  COLORS,
  GRADIENTS,
  SCALE,
  SHADOWS,
  Y_OFFSET,
} from './constants'

export const backgroundVariant: Variants = {
  initial: {
    backgroundColor: GRADIENTS.GRAY,
    boxShadow: SHADOWS.INITIAL,
    scale: SCALE.INITIAL,
  },
  animate: {
    backgroundColor: GRADIENTS.GRAY,
    boxShadow: SHADOWS.INITIAL,
    scale: SCALE.INITIAL,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: ANIMATION_EASING,
    },
  },
  tap: {
    backgroundColor: GRADIENTS.GRAY,
    boxShadow: SHADOWS.TAP,
    scale: SCALE.TAP,
    y: Y_OFFSET.TAP,
    transition: {
      duration: ANIMATION_DURATION.FAST,
      ease: ANIMATION_EASING,
    },
  },
}

export const firstTextVariant: Variants = {
  initial: {
    color: COLORS.GRAY[400],
    opacity: 1,
  },
  tap: {
    color: COLORS.GRAY[800],
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: ANIMATION_EASING,
    },
  },
  animate: {
    color: COLORS.GRAY[400],
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: ANIMATION_EASING,
    },
  },
}

export const secondTextVariant: Variants = {
  initial: {
    y: 20,
    color: COLORS.GRAY[400],
    opacity: 0,
  },
  tap: {
    color: COLORS.GRAY[800],
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: ANIMATION_EASING,
    },
  },
  animate: {
    color: COLORS.GRAY[400],
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: ANIMATION_EASING,
    },
  },
}
