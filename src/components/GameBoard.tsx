import { useState } from 'react'

interface GameBoardProps {
  category: string
  currentScore: number
  maxAttempts: number
}

interface GuessResult {
  guess: string
  rank: number
  score: number
}

export const GameBoard = ({ category, currentScore, maxAttempts }: GameBoardProps) => {
  const [attempts, setAttempts] = useState<GuessResult[]>([])

  // TODO: Implement guess submission logic
  // TODO: Add scoring system based on rank difference
  // TODO: Add game over condition
  // TODO: Implement hint system
  // TODO: Add animations for correct/incorrect guesses

  return (
    <div className="game-board">
      <h2>Category: {category}</h2>
      {/* TODO: Add guess input form */}
      {/* TODO: Add guess history display */}
      {/* TODO: Add score display */}
      {/* TODO: Add remaining attempts counter */}
    </div>
  )
} 