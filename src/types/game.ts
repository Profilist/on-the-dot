export interface Guess {
  item: string      // Changed from 'movie' to be category-agnostic
  rank?: number     // Optional since not all guesses will be in top 100
  isInTop100: boolean
}

export interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: string
} 