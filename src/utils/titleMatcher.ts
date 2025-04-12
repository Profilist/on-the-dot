export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '');         // Remove all spaces
}

export function isTitleMatch(
  guess: string,
  dbTitle: string,
  maxDistance: number = 2
): boolean {
  const normalizedGuess = normalizeTitle(guess);
  const normalizedTitle = normalizeTitle(dbTitle);

  // Exact match shortcut
  if (normalizedGuess === normalizedTitle) {
    return true;
  }

  const distance = levenshteinDistance(normalizedGuess, normalizedTitle);
  return distance <= maxDistance;
}

function levenshteinDistance(s: string, t: string): number {
  const m = s.length;
  const n = t.length;

  // Create a 2D matrix with dimensions (m+1) x (n+1)
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  // Compute the Levenshtein distance with a dynamic programming approach
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}
