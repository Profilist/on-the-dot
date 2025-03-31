import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface FinishedProps {
  score: number
  averageScore: number
  streak: number
  maxStreak: number
  onPlayAgain: () => void
  onShare: () => void
  categoryStats: {
    totalPlays: number
    scoreDistribution: number[]
  }
}

export function Finished({ 
  score, 
  averageScore, 
  streak, 
  maxStreak,
  onPlayAgain,
  onShare,
  categoryStats
}: FinishedProps) {
  const [isShared, setIsShared] = useState(false)
  
  const handleShare = () => {
    onShare()
    setIsShared(true)
    // Reset after 2 seconds
    setTimeout(() => setIsShared(false), 2000)
  }

  const percentage = (score / 394) * 100
  const percentageAverage = (averageScore / 394) * 100

  const calculatePercentile = (score: number, distribution: number[]) => {
    if (distribution.length === 0) return 0
    const belowScore = distribution.filter(s => s < score).length
    return Math.round((belowScore / distribution.length) * 100)
  }

  const getMessage = (score: number) => {
    if (score === 0) return "Wrong category?"
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
      className="w-full max-w-xl flex flex-col items-center gap-8 mt-12 bg-white p-8 rounded-xl"
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

        {/* Progress Bars */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Your Score</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#FF2C2C]"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Average Score</span>
              <span>{Math.round(percentageAverage)}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${percentageAverage}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </div>
        </div>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {categoryStats.totalPlays > 0 ? (
            <div className="space-y-2">
              <div className="text-xl font-bold">
                You beat {calculatePercentile(score, categoryStats.scoreDistribution)}% of players!
              </div>
              <div className="text-sm text-gray-600">
                Out of {categoryStats.totalPlays} total plays
              </div>
            </div>
          ) : (
            <div className="text-lg text-gray-600">
              First play in this category!
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={handleShare}
          className="flex-1 py-4 border-2 border-black rounded-full hover:bg-gray-50 
                   transition-colors duration-200 relative overflow-hidden min-h-[60px]"
        >
          <AnimatePresence mode="wait">
            {isShared ? (
              <motion.div
                key="copied"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center h-full"
              >
                Copied! 🎉
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                Share Your Results!
              </motion.div>
            )}
          </AnimatePresence>
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
