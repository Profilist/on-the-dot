import { useState, useCallback, useEffect } from 'react'
import { GuessInput } from './components/GuessInput'
import { GuessHistory } from './components/GuessHistory'
import { ProgressBar } from './components/ProgressBar'
import { Footer } from '../../components/Footer'
import { useSupabase } from '../../hooks/useSupabase'
import type { Guess, GameState } from '../../types/game'
import { Instructions } from './components/Instructions'
import { motion } from 'framer-motion'

interface GamePageProps {
  onReturnHome: () => void
}

function calculateScore(guesses: Guess[]): number {
  return guesses.reduce((total, guess) => {
    if (!guess.rank) return total
    // Award points based on how close the guess is to being in top 100
    const pointValue = guess.isInTop100 ? guess.rank : 0
    return total + pointValue
  }, 0)
}

export function GamePage({ }: GamePageProps) {
  const { checkRank, getRandomCategory } = useSupabase()
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    remainingGuesses: 4,
    isGameOver: false,
    currentCategory: 'movies'
  })

  // Initialize game with random category
  useEffect(() => {
    const category = getRandomCategory()
    setGameState(prev => ({ ...prev, currentCategory: category }))
  }, [getRandomCategory])

  const handleGuess = useCallback(async (guess: string) => {
    if (gameState.remainingGuesses === 0 || gameState.isGameOver) return

    // Get all previous guesses' original titles for duplicate checking
    const previousGuesses = gameState.guesses.map(g => g.originalTitle)
    
    const result = await checkRank(guess, gameState.currentCategory, previousGuesses)
    
    const newGuess: Guess = {
      item: guess,
      originalTitle: result.title,
      rank: result.isMatch ? result.rank : undefined,
      isInTop100: result.isMatch
    }

    setGameState(prev => {
      const newGuesses = [...prev.guesses, newGuess]
      const newRemainingGuesses = prev.remainingGuesses - 1
      const isGameOver = newRemainingGuesses === 0

      return {
        ...prev,
        guesses: newGuesses,
        remainingGuesses: newRemainingGuesses,
        isGameOver
      }
    })
  }, [gameState.remainingGuesses, gameState.isGameOver, gameState.guesses, checkRank, gameState.currentCategory])

  const showInstructions = gameState.guesses.length === 0

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-[200px] mt-8 mb-12"
        >
          <img src="/logo.svg" alt="On the Dot Logo" className="w-full h-auto" />
        </motion.div>

        {/* Category Title */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-mono uppercase tracking-wider mb-12"
        >
          Top 100 {gameState.currentCategory}
        </motion.h1>

        {/* Input Section - wrap in motion div */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GuessInput 
            onSubmit={handleGuess}
            disabled={gameState.isGameOver || gameState.remainingGuesses === 0}
          />
        </motion.div>
      </div>

      {showInstructions ? (
        <Instructions category={gameState.currentCategory} />
      ) : (
        <>
          {/* Guesses Remaining */}
          <div className="mt-6 mb-8 flex gap-2 items-center justify-center">
            <p className="text-base font-medium text-gray-700">Guesses Remaining:</p>
            <div className="flex gap-3 items-center justify-center">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < gameState.remainingGuesses ? 'bg-black' : 'bg-[#FF2C2C]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Guess History */}
          <div className="w-full max-w-2xl space-y-4">
            <GuessHistory guesses={gameState.guesses} />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl mt-8">
            <ProgressBar 
              progress={calculateScore(gameState.guesses)}
              total={394}
            />
          </div>
        </>
      )}

      <Footer className="mt-auto py-8" />
    </div>
  )
} 