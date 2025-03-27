import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { GuessInput } from './components/GuessInput'
import { GuessHistory } from './components/GuessHistory'
import { ProgressBar } from './components/ProgressBar'
import { Footer } from '../../components/Footer'
import { useSupabase } from '../../hooks/useSupabase'
import type { Guess, GameState } from '../../types/game'

interface GamePageProps {
  onReturnHome: () => void
}

export function GamePage({ onReturnHome }: GamePageProps) {
  const { checkMovieRank, isLoading, error } = useSupabase()
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    remainingGuesses: 4,
    isGameOver: false,
    currentCategory: 'Movies'
  })

  const handleGuess = useCallback(async (movieGuess: string) => {
    if (gameState.remainingGuesses === 0 || gameState.isGameOver) return

    const rank = await checkMovieRank(movieGuess)
    const newGuess: Guess = {
      movie: movieGuess,
      rank: rank || undefined,
      isInTop100: rank !== null
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
  }, [gameState.remainingGuesses, gameState.isGameOver, checkMovieRank])

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-4">
      {/* Logo */}
      <div className="w-[200px] mt-8 mb-12">
        <img src="/logo.svg" alt="On the Dot Logo" className="w-full h-auto" />
      </div>

      {/* Category Title */}
      <h1 className="text-4xl font-mono uppercase tracking-wider mb-12">
        Top 100 {gameState.currentCategory}
      </h1>

      {/* Input Section */}
      <div className="w-full max-w-2xl">
        <GuessInput 
          onSubmit={handleGuess}
          disabled={gameState.isGameOver || gameState.remainingGuesses === 0}
        />
      </div>

      {/* Guesses Remaining */}
      <div className="mt-6 mb-8">
        <p className="text-sm">Guesses Remaining:</p>
        <div className="flex gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full ${
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
          progress={gameState.guesses.filter(g => g.isInTop100).length} 
          total={100}
        />
      </div>

      <Footer className="mt-auto py-8" />
    </div>
  )
} 