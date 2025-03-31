import { motion } from 'framer-motion'

interface DottedBackgroundProps {
  color?: string
  dotSize?: number
  spacing?: number
  opacity?: number
}

export function DottedBackground({ 
  color = '#FF2C2C',
  dotSize = 2,
  spacing = 40,
  opacity = 0.1
}: DottedBackgroundProps) {
  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  )
} 