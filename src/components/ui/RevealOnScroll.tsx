'use client'

import { motion, useReducedMotion } from 'motion/react'

type RevealOnScrollProps = {
  children: React.ReactNode
  delay?: number
}

export function RevealOnScroll({ children, delay = 0 }: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
