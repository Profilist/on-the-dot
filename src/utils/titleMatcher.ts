export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isTitleMatch(
  guess: string,
  dbTitle: string,
  maxDistance: number = 1
): boolean {
  const normalizedGuess = normalizeTitle(guess);
  const normalizedTitle = normalizeTitle(dbTitle);

  if (normalizedGuess === normalizedTitle) {
    return true;
  }

  const guessWords = normalizedGuess.split(' ').filter(w => w.length > 0);
  const titleWords = normalizedTitle.split(' ').filter(w => w.length > 0);

  if (guessWords.length !== titleWords.length) {
    return false;
  }

  for (let i = 0; i < guessWords.length; i++) {
    const wordDistance = levenshteinDistance(guessWords[i], titleWords[i]);
    if (wordDistance > maxDistance) {
      return false;
    }
  }

  return true;
}

function levenshteinDistance(s: string, t: string): number {
  const m = s.length;
  const n = t.length;

  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}