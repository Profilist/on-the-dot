import type { Category } from '../hooks/useSupabase'

export interface Guess {
  item: string          // User's guess
  originalTitle: string // Original title from database
  rank?: number
  isInTop100: boolean
  guessCount?: number   // Number of times this item has been guessed
}

export interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: Category
} 