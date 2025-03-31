import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  total: number
}

export function ProgressBar({ progress, total }: ProgressBarProps) {
  const percentage = Math.min((progress / total) * 100, 100)
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-2">
        <motion.span 
          className="text-sm font-medium"
          animate={{ scale: progress > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          Score: {progress}
        </motion.span>
        <span className="text-sm text-gray-600">Max: {total}</span>
      </div>
      <div className="w-full h-8 bg-white border-2 border-black rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[#FF2C2C]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
} 