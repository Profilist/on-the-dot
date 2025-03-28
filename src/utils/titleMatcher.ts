export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Normalize spaces
    .trim()
}

export function isTitleMatch(guess: string, dbTitle: string): boolean {
  const normalizedGuess = normalizeTitle(guess)
  const normalizedDbTitle = normalizeTitle(dbTitle)
  
  // Split into words for more flexible matching
  const guessWords = normalizedGuess.split(' ')
  const dbWords = normalizedDbTitle.split(' ')
  
  // If guess is longer than DB title, it's probably too specific
  if (guessWords.length > dbWords.length) return false
  
  // Check if all guess words are contained in the DB title
  return guessWords.every(word => 
    dbWords.some(dbWord => dbWord.includes(word))
  )
} 