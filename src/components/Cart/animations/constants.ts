export const ANIMATION_DURATION = {
  FAST: 0.15,
  MEDIUM: 0.3,
  SLOW: 0.4,
} as const

export const ANIMATION_EASING = [0.19, 1, 0.22, 1] as const

export const COLORS = {
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    400: '#9ca3af',
    800: '#1f2937',
  },
  GREEN: {
    100: '#dcfce7',
    300: '#a3e635',
    400: '#84cc16',
    700: '#4d7c0f',
    800: '#16a34a',
  },
  WHITE: '#ffffff',
} as const

export const GRADIENTS = {
  GRAY: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
} as const

export const SHADOWS = {
  INITIAL:
    'inset 0 -2px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.05)',
  HOVER:
    'inset 0 -3px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.08)',
  TAP: 'inset 0 1px 0 rgba(0,0,0,0.15), inset 0 -1px 0 rgba(255,255,255,0.4), 0 1px 1px rgba(0,0,0,0.1)',
} as const

export const SCALE = {
  INITIAL: 1,
  HOVER: 1.02,
  TAP: 0.98,
} as const

export const Y_OFFSET = {
  INITIAL: 0,
  HOVER: -20,
  TAP: 1,
} as const
