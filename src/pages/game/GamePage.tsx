import { useState, useCallback, useEffect } from 'react'
import { GuessInput } from './components/GuessInput'
import { GuessHistory } from './components/GuessHistory'
import { ProgressBar } from './components/ProgressBar'
import { Footer } from '../../components/Footer'
import { useSupabase, CATEGORY_DISPLAY_NAMES } from '../../hooks/useSupabase'
import { useGame } from '../../hooks/useGame'
import type { Guess } from '../../types/game'
import { Instructions } from './components/Instructions'
import { motion, AnimatePresence } from 'framer-motion'
import { Finished } from './components/Finished'
import { DottedBackground } from '../../components/DottedBackground'
import { useAnonymousId } from '../../hooks/useAnonymousId'
import { useUserStats } from '../../hooks/useUserStats'
import { Category } from '../../hooks/useSupabase'

function calculateScore(guesses: Guess[]): number {
  return guesses.reduce((total, guess) => {
    if (!guess.rank) return total
    const pointValue = guess.isInTop100 ? guess.rank : 0
    return total + pointValue
  }, 0)
}

interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: Category
}

export function GamePage() {
  const { checkRank, getRandomCategory } = useSupabase()
  const { initializeUser } = useGame()
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    remainingGuesses: 4,
    isGameOver: false,
    currentCategory: "grossing movies"
  })
  const [showResults, setShowResults] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const userId = useAnonymousId()
  const { savePlay, stats, categoryStats, loadCategoryStats, loadStats } = useUserStats(userId)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  // Initialize user and load stats
  useEffect(() => {
    const newUserId = initializeUser()
    if (newUserId) {
      loadStats()
    }
  }, [initializeUser, loadStats])

  // Load category stats when category changes
  useEffect(() => {
    loadCategoryStats(CATEGORY_DISPLAY_NAMES[gameState.currentCategory])
  }, [gameState.currentCategory, loadCategoryStats])

  // Update stats from user_stats
  useEffect(() => {
    if (stats) {
      setStreak(stats.current_streak || 0)
      setMaxStreak(stats.max_streak || 0)
    }
  }, [stats])

  // Initialize game with random category
  useEffect(() => {
    const category = getRandomCategory()
    setGameState(prev => ({ ...prev, currentCategory: category }))
  }, [getRandomCategory])

  const handleGuess = useCallback(async (guess: string) => {
    if (gameState.remainingGuesses === 0 || gameState.isGameOver) return

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

      if (isGameOver) {
        setIsExiting(true)
        // Wait for exit animations to complete before showing results
        setTimeout(() => {
          setShowResults(true)
        }, 1200) // Slightly longer than exit animation duration
      }

      return {
        ...prev,
        guesses: newGuesses,
        remainingGuesses: newRemainingGuesses,
        isGameOver
      }
    })

    // If game is over, save the results after state update
    if (gameState.remainingGuesses === 1) { 
      const score = calculateScore([...gameState.guesses, newGuess])
      savePlay(score, CATEGORY_DISPLAY_NAMES[gameState.currentCategory], [...gameState.guesses, newGuess]).then(() => {
        // Reload stats and category stats after saving to ensure we have latest data
        loadStats()
        loadCategoryStats(CATEGORY_DISPLAY_NAMES[gameState.currentCategory])
      })
    }
  }, [gameState.remainingGuesses, gameState.isGameOver, gameState.guesses, checkRank, gameState.currentCategory, savePlay])

  const handlePlayAgain = useCallback(() => {
    const category = getRandomCategory()
    setGameState({
      guesses: [],
      remainingGuesses: 4,
      isGameOver: false,
      currentCategory: category
    })
    setShowResults(false)
  }, [getRandomCategory])

  const handleShare = useCallback(() => {
    const score = calculateScore(gameState.guesses)
    const date = new Date().toLocaleDateString()
    const categoryName = gameState.currentCategory.charAt(0).toUpperCase() + gameState.currentCategory.slice(1)
    
    // Create an aesthetic share text
    const shareText = [
      `🎯 On The Dot - ${categoryName} (${date})`,
      `Score: ${score} points`,
      '',
      'My guesses:',
      ...gameState.guesses.map((guess, index) => {
        const indicator = guess.isInTop100 ? '✅' : '❌'
        const rank = guess.rank ? `#${guess.rank}` : 'not in top 100'
        return `${index + 1}. ${guess.originalTitle} ${indicator} ${rank}`
      }),
      '',
      `🎮 Play at: https://on-the-dot.vercel.app`
    ].join('\n')

    // Copy to clipboard
    navigator.clipboard.writeText(shareText)
      .then(() => {
        // You could add a toast notification here if you have one
        console.log('Results copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy results:', err)
      })
  }, [gameState.guesses, gameState.currentCategory])

  const showInstructions = gameState.guesses.length === 0

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 relative">
      <DottedBackground />

      {/* Main content wrapper with background */}
      <div className="relative z-10 w-full flex flex-col items-center max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState.isGameOver && showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex justify-center items-center"
            >
              <div className="w-full max-w-2xl">
                <Finished 
                  score={calculateScore(gameState.guesses)}
                  streak={streak}
                  maxStreak={maxStreak}
                  categoryStats={categoryStats}
                  onPlayAgain={handlePlayAgain}
                  onShare={handleShare}
                />
              </div>
            </motion.div>
          )}
          {!showResults && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="w-full max-w-2xl">
                {/* Logo */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="w-[200px] mt-8 mb-12 bg-white/100"
                >
                  <img src="/logo.svg" alt="On the Dot Logo" className="w-full h-auto" />
                </motion.div>

                {/* Category Title */}
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: isExiting ? 0 : 0.2 }}
                  className="text-6xl font-tech-mono uppercase tracking-wider mb-12 bg-white/100"
                >
                  Top 100 {gameState.currentCategory}
                </motion.h1>

                {/* Input Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: isExiting ? 0 : 0.4 }}
                  className="bg-white/100"
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: isExiting ? 0 : 0.6 }}
                >
                  {/* Guesses Remaining */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: isExiting ? 0 : 0.6 }}
                    className="mt-6 mb-8 flex gap-2 items-center justify-center bg-white/100"
                  >
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
                  </motion.div>

                  {/* Guess History */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: isExiting ? 0 : 0.6 }}
                    className="w-full max-w-2xl space-y-4 bg-white/100"
                  >
                    <GuessHistory guesses={gameState.guesses} />
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: isExiting ? 0 : 0.6 }}
                    className="w-full max-w-2xl mt-8 bg-white/100"
                  >
                    <ProgressBar 
                      progress={calculateScore(gameState.guesses)}
                      total={394}
                    />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Footer className="mt-auto py-8 bg-white/100 backdrop-blur-sm w-full" />
      </div>
    </div>
  )
} 