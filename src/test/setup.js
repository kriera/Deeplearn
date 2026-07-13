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

// Mock framer-motion for jsdom — motion.* → native HTML elements
vi.mock('framer-motion', () => {
  const createMotionComponent = (Tag) => {
    const Comp = React.forwardRef(({ children, className, ...props }, ref) => {
      const {
        initial, animate, exit, transition, variants,
        whileHover, whileTap, whileInView, whileFocus, whileDrag,
        drag, dragConstraints, dragElastic,
        layout, layoutId,
        onAnimationStart, onAnimationComplete,
        ...htmlProps
      } = props
      return React.createElement(Tag, { ref, className, ...htmlProps }, children)
    })
    Comp.displayName = `motion.${Tag}`
    return Comp
  }

  const motion = new Proxy({}, {
    get: (_, tag) => createMotionComponent(tag),
  })

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    default: motion,
  }
})
