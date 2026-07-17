import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// React 19.2.7 production build doesn't export act().
if (!React.act) {
  React.act = (callback) => {
    if (typeof callback === 'function') return callback()
    return callback
  }
}

if (typeof globalThis.IS_REACT_ACT_ENVIRONMENT === 'undefined') {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
}

// Props exclusivas de framer-motion que no deben llegar al DOM en jsdom.
const MOTION_ONLY_PROPS = new Set([
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileInView',
  'whileFocus',
  'whileDrag',
  'drag',
  'dragConstraints',
  'dragElastic',
  'layout',
  'layoutId',
  'onAnimationStart',
  'onAnimationComplete',
])

// Mock framer-motion for jsdom — motion.* → native HTML elements
vi.mock('framer-motion', () => {
  const createMotionComponent = (Tag) => {
    const Comp = React.forwardRef(({ children, className, ...props }, ref) => {
      const htmlProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !MOTION_ONLY_PROPS.has(key)),
      )
      return React.createElement(Tag, { ref, className, ...htmlProps }, children)
    })
    Comp.displayName = `motion.${Tag}`
    return Comp
  }

  // Memoizado por tag: devolver el MISMO componente en cada acceso evita que
  // React remonte el subárbol en cada render (lo que rompería el foco y el valor
  // de los inputs al teclear con userEvent).
  const motionCache = new Map()
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        if (!motionCache.has(tag)) motionCache.set(tag, createMotionComponent(tag))
        return motionCache.get(tag)
      },
    },
  )

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    default: motion,
  }
})
