import type { Guess } from '../../../types/game'
import { motion, AnimatePresence } from 'framer-motion'

interface GuessHistoryProps {
  guesses: Guess[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  const isTopRank = (rank: number) => rank >= 90 && rank <= 100

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {guesses.map((guess, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full h-16 rounded-full flex items-center relative overflow-hidden
              ${guess.isInTop100 
                ? 'bg-black text-white' 
                : 'bg-white border-2 border-black'
              }`}
          >
            {/* Container for red circle indicator with fixed width */}
            <div className="w-10 ml-6 flex items-center">
              {guess.rank && isTopRank(guess.rank) && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  className="w-4 h-4 bg-[#FF2C2C] rounded-full" 
                />
              )}
            </div>
            
            <motion.div className="relative flex-grow">
              <motion.span 
                initial={{ y: 0, opacity: 1 }}
                whileHover={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl block"
              >
                {guess.originalTitle}
              </motion.span>
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                whileHover={{ y: -30, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl absolute top-[30px] left-0"
              >
                {`This has been guessed ${guess.guessCount || 1} ${guess.guessCount === 1 ? 'time' : 'times'}!`}
              </motion.span>
            </motion.div>
            
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`ml-auto mr-8 text-2xl font-mono text-[#FF2C2C]`}
            >
              {guess.isInTop100 ? `#${guess.rank}` : 'X'}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 