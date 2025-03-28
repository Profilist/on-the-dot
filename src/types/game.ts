import type { Category } from '../hooks/useSupabase'

export interface Guess {
  item: string          // User's guess
  originalTitle: string // Original title from database
  rank?: number
  isInTop100: boolean
}

export interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: Category
} 