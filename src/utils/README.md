# Title Matcher
> A word-level fuzzy matching utility for typo-tolerant title comparison.

## Overview

The title matcher implements an approach to handle common typos with low latency. It uses word-level Levenshtein distance to allow for minor spelling mistakes while maintaining accuracy.

## Features

- **Word-level matching**: Compares each word individually, preventing word insertion/deletion
- **Typo tolerance**: Allows 1-2 character difference per word
- **Case insensitive**: Allows different letter cases
- **Special character normalization**: Ignores punctuation and special characters
- **Performance optimized**: Early termination for exact matches

## Usage

```typescript
import { isTitleMatch } from './titleMatcher';

// Basic usage
isTitleMatch('Snop Dog', 'Snoop Dogg'); // true
isTitleMatch('Snop Dog', 'Snap Chat');  // false

// With custom distance threshold
isTitleMatch('Snap Dog', 'Snoop Dogg', 2); // true
```

## Running Tests
```bash
npm run test:title-matcher
```

## Performance

The implementation is optimized for low latency:
- Exact matches use early termination
- Word-level comparison prevents unnecessary calculations
- Average performance: ~0.01ms per match

## Implementation Details

### Normalization
1. Convert to lowercase
2. Remove special characters (preserve spaces)
3. Normalize multiple spaces to single space
4. Trim leading/trailing whitespace

### Matching Algorithm
1. Check for exact match after normalization
2. Split into words
3. Verify same word count
4. Apply Levenshtein distance per word pair
5. Return true if all words are within threshold

### Levenshtein Distance
Uses dynamic programming for efficient calculation of edit distance between strings