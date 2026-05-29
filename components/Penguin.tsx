'use client'

import { motion, type TargetAndTransition, type Transition } from 'framer-motion'

type PenguinMood = 'happy' | 'excited' | 'thinking' | 'celebrate' | 'wave'

type Props = {
  mood?: PenguinMood
  size?: number
  className?: string
}

export default function Penguin({ mood = 'happy', size = 120, className = '' }: Props) {
  const animations: Record<PenguinMood, { animate: TargetAndTransition; transition: Transition }> = {
    wave: {
      animate: { rotate: [0, -8, 8, -5, 0], y: [0, -6, 0] },
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      animate: { y: [0, -8, 0] },
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    excited: {
      animate: { y: [0, -14, 0, -10, 0], rotate: [0, -5, 5, -3, 0] },
      transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1 },
    },
    celebrate: {
      animate: { y: [0, -18, 0], scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] },
      transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 },
    },
    thinking: {
      animate: { rotate: [-3, 3, -3], y: [0, -4, 0] },
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
  }

  const { animate, transition } = animations[mood]

  return (
    <motion.div
      className={`inline-block select-none ${className}`}
      animate={animate}
      transition={transition}
      style={{ width: size, height: size, background: 'transparent', lineHeight: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/penguin.png"
        alt="Ping — mascota de Melinglish"
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: size, height: size }}
      />
    </motion.div>
  )
}
