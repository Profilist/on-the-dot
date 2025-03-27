export interface Guess {
  movie: string
  rank?: number  // Optional since not all guesses will be in top 100
  isInTop100: boolean
}

export interface GameState {
  guesses: Guess[]
  remainingGuesses: number
  isGameOver: boolean
  currentCategory: string
} 