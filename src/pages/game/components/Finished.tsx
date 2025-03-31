import { motion } from 'framer-motion'

interface FinishedProps {
  score: number
  averageScore: number
  streak: number
  maxStreak: number
  onPlayAgain: () => void
  onShare: () => void
}

export function Finished({ 
  score, 
  averageScore, 
  streak, 
  maxStreak,
  onPlayAgain,
  onShare 
}: FinishedProps) {
  const percentage = (score / averageScore) * 100

  const getMessage = (score: number) => {
    if (score === 0) return "Got the wrong category?"
    if (score <= 100) return "Not Bad!"
    if (score <= 200) return "Wow!"
    if (score <= 300) return "You cheating?"
    return "Ice cold."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl flex flex-col items-center gap-8 mt-12"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="w-12 h-12 bg-[#FF2C2C] rounded-full" />
        <h2 className="text-6xl font-tech-mono">{getMessage(score)}</h2>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full border-3 border-black rounded-3xl p-8 space-y-4"
      >
        {/* Score Row */}
        <div className="flex gap-4 items-center">
          <span className="text-2xl font-medium">Final Score: {score}</span>
          <div className="w-4 h-4 bg-[#FF2C2C] rounded-full" />
        </div>

        {/* Average Score Row */}
        <div className="flex gap-4 items-center">
          <span className="text-2xl text-gray-700">Average Score: {averageScore}</span>
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
        </div>

        {/* Streak Info */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="text-xl text-gray-600">Streak: {streak} day</div>
          <div className="text-xl text-gray-600">Max Streak: {maxStreak} days</div>
        </div>

        {/* Progress Bar */}
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#FF2C2C]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${100-percentage}%` }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>
        <div className="font-bold">
            You beat 100% of users!
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={onShare}
          className="flex-1 py-4 border-2 border-black rounded-full hover:bg-gray-50 
                   transition-colors duration-200"
        >
          Share Your Results!
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          onClick={onPlayAgain}
          className="flex-1 py-4 bg-black text-white rounded-full 
                   hover:bg-gray-800 transition-colors duration-200"
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  )
}
