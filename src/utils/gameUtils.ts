interface RankData {
  item: string
  rank: number
  category: string
}

// TODO: Implement data fetching from API or local storage
export const fetchTop100 = async (category: string): Promise<RankData[]> => {
  throw new Error('Not implemented')
}

// TODO: Implement scoring calculation
export const calculateScore = (actualRank: number, guessedRank: number): number => {
  return 0
}

// TODO: Implement hint generation
export const generateHint = (item: RankData, previousGuesses: string[]): string => {
  return ''
}

// TODO: Implement guess validation
export const validateGuess = (guess: string, category: string): boolean => {
  return false
}

// TODO: Implement category selection
export const getRandomCategory = (): string => {
  return ''
}

// TODO: Implement leaderboard sorting
export const sortLeaderboard = (scores: Array<{ score: number, name: string }>) => {
  return []
} 