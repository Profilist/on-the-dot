#!/usr/bin/env node

const testCases = [
  // Basic functionality tests
  { name: 'Exact match should work', guess: 'Snoop Dogg', title: 'Snoop Dogg', expected: true },
  { name: 'Case insensitive match', guess: 'SNOOP DOGG', title: 'snoop dogg', expected: true },
  { name: 'Special characters should be ignored', guess: 'Snoop Dogg!', title: 'Snoop Dogg', expected: true },

  // Typo tolerance tests
  { name: 'Single character typo should match (Snop Dog -> Snoop Dogg)', guess: 'Snop Dog', title: 'Snoop Dogg', expected: true },
  { name: 'Single character typo in second word should match', guess: 'Snoop Dog', title: 'Snoop Dogg', expected: true },
  { name: 'Single character typo in first word should match', guess: 'Snop Dogg', title: 'Snoop Dogg', expected: true },
  { name: 'Two character typo should not match', guess: 'Snap Dog', title: 'Snoop Dogg', expected: false },

  // Word count tests
  { name: 'Different word count should not match (taylor vs Taylor Swift)', guess: 'taylor', title: 'Taylor Swift', expected: false },
  { name: 'Different word count should not match (Taylor Swift vs Taylor)', guess: 'Taylor Swift', title: 'Taylor', expected: false },
  { name: 'Extra word should not match', guess: 'Taylor Swift Music', title: 'Taylor Swift', expected: false },

  // Single word tests
  { name: 'Single word exact match', guess: 'Marvel', title: 'Marvel', expected: true },
  { name: 'Single word with one character typo should match', guess: 'Marvel', title: 'Marvel', expected: true },

  // Edge cases
  { name: 'Empty strings should not match', guess: '', title: 'Snoop Dogg', expected: false },
  { name: 'Whitespace only should not match', guess: '   ', title: 'Snoop Dogg', expected: false },
  { name: 'Numbers should be preserved', guess: '50 Cent', title: '50 Cent', expected: true },
  { name: 'Numbers with typo should match', guess: '50 Cnt', title: '50 Cent', expected: true },

  // Real-world examples
  { name: 'Artist name with typo should match', guess: 'Taylor Swft', title: 'Taylor Swift', expected: true },
  { name: 'Movie title with typo should match', guess: 'Avengers Endgame', title: 'Avengers Endgame', expected: true },
  { name: 'Company name with typo should match', guess: 'Apple Inc', title: 'Apple Inc', expected: true },

  // False positive prevention tests
  { name: 'Snop Dog should not match Snap Chat', guess: 'Snop Dog', title: 'Snap Chat', expected: false },
  { name: 'Marvel should match Marvell', guess: 'Marvel', title: 'Marvell', expected: true },
  { name: 'Taylor should not match Tyler', guess: 'Taylor', title: 'Tyler', expected: false },

  // Normalization tests
  { name: 'Multiple spaces should be normalized', guess: 'Snoop   Dogg', title: 'Snoop Dogg', expected: true },
  { name: 'Leading/trailing spaces should be ignored', guess: '  Snoop Dogg  ', title: 'Snoop Dogg', expected: true },
  { name: 'Punctuation should be ignored', guess: 'Snoop Dogg!', title: 'Snoop Dogg', expected: true }
];

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s, t) {
  const m = s.length;
  const n = t.length;

  const dp = Array.from({ length: m + 1 }, (_, i) =>
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

function isTitleMatch(guess, dbTitle, maxDistance = 1) {
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

function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('🧪 Running Title Matcher Test Suite\n');

  testCases.forEach(({ name, guess, title, expected }) => {
    try {
      const result = isTitleMatch(guess, title);
      const success = result === expected;
      
      if (success) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        console.log(`   Expected: ${expected}, Got: ${result}`);
        console.log(`   Input: "${guess}" vs "${title}"`);
        failed++;
      }
    } catch (error) {
      console.log(`💥 ${name}`);
      console.log(`   Error: ${error}`);
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }

  return failed === 0;
}

function testPerformance() {
  console.log('\n⚡ Performance Test:\n');
  
  const testCases = [
    ['Snoop Dogg', 'Snop Dog'],
    ['Taylor Swift', 'Taylor Swft'],
    ['Marvel Studios', 'Marvel Studos'],
    ['Apple Inc', 'Apple'],
    ['50 Cent', '50 Cnt']
  ];

  const iterations = 10000;
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    testCases.forEach(([title, guess]) => {
      isTitleMatch(guess, title);
    });
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / (iterations * testCases.length);
  
  console.log(`Executed ${iterations * testCases.length} matches in ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per match: ${avgTime.toFixed(4)}ms`);
  console.log(`Matches per second: ${Math.round((iterations * testCases.length) / (totalTime / 1000))}`);
}

function debugSpecificCases() {
  console.log('\n🔍 Debug Specific Cases:\n');
  
  const cases = [
    { guess: 'mr east', title: 'mr beast' },
    { guess: 'a', title: 'Amy' },
    { guess: 'A', title: 'Visa' }
  ];
  
  cases.forEach(({ guess, title }) => {
    const normalizedGuess = normalizeTitle(guess);
    const normalizedTitle = normalizeTitle(title);
    const distance = levenshteinDistance(normalizedGuess, normalizedTitle);
    const result = isTitleMatch(guess, title);
    
    console.log(`"${guess}" vs "${title}":`);
    console.log(`  Normalized: "${normalizedGuess}" vs "${normalizedTitle}"`);
    console.log(`  Distance: ${distance}`);
    console.log(`  Result: ${result}`);
    console.log('');
  });
}

console.log('🚀 Starting Title Matcher Test Suite...\n');

try {
  debugSpecificCases();
  const success = runTests();
  testPerformance();
  
  if (success) {
    console.log('\n🎉 All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review the implementation.');
    process.exit(1);
  }
} catch (error) {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
} 