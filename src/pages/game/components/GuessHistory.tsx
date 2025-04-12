import type { Guess } from '../../../types/game'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface GuessHistoryProps {
  guesses: Guess[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  const isTopRank = (rank: number) => rank >= 90 && rank <= 100
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleInteractionStart = (index: number) => {
    setHoveredIndex(index)
  }

  const handleInteractionEnd = () => {
    setHoveredIndex(null)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {guesses.map((guess, index) => {
          const isHovered = hoveredIndex === index
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => handleInteractionStart(index)}
              onHoverEnd={handleInteractionEnd}
              onTouchStart={() => handleInteractionStart(index)}
              onTouchEnd={handleInteractionEnd}
              onTouchCancel={handleInteractionEnd}
              className={`w-full h-16 rounded-full flex items-center relative overflow-hidden
                ${guess.isInTop100 
                  ? 'bg-black text-white' 
                  : 'bg-white border-2 border-black'
                } touch-manipulation`}
            >

              <div className="w-10 ml-6 flex items-center">
                {guess.rank && (isTopRank(guess.rank)) && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    className="w-4 h-4 bg-[#FF2C2C] rounded-full" 
                  />
                )}
              </div>
              
              <div className="relative flex-grow overflow-hidden h-full flex items-center">
                <motion.span 
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: isHovered ? -30 : 0, opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl md:text-2xl absolute inset-0 flex items-center truncate"
                >
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {guess.originalTitle}
                  </div>
                </motion.span>
                <motion.span
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl md:text-2xl absolute inset-0 flex items-center truncate"
                >
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {guess.guessCount === 1 ? (
                      <span>
                        <span className="md:hidden">First guess!</span>
                        <span className="hidden md:inline">Congrats, you're the first!</span>
                      </span>
                    ) : (
                      <span>
                        <span className="md:hidden">{guess.guessCount} past guesses!</span>
                        <span className="hidden md:inline">{guess.guessCount} players have guessed this!</span>
                      </span>
                    )}
                  </div>
                </motion.span>
              </div>

              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className={`ml-8 w-16 text-2xl font-mono text-[#FF2C2C]`}
              >
                {guess.isInTop100 ? `#${guess.rank}` : 'X'}
              </motion.span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}