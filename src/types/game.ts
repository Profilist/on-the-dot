import type { Category } from '../hooks/useSupabase'

export interface Guess {
  item: string
  originalTitle: string
  rank?: number
  isInTop100: boolean
  guessCount: number
  aliases: string[]
}

export interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: Category
}