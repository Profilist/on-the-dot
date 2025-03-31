export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Normalize spaces
    .trim()
}

// We don't need the complex isTitleMatch anymore since we're using aliases
export function isTitleMatch(guess: string, dbTitle: string): boolean {
  return normalizeTitle(guess) === normalizeTitle(dbTitle)
} 