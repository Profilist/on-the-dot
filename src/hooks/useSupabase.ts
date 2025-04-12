import { useState, useCallback } from 'react'
import { supabase, isSupabaseError } from '../lib/supabase'
import { isTitleMatch } from '../utils/titleMatcher'
import { useGuessStats } from '../hooks/useGuessStats'

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second
const AVAILABLE_CATEGORIES = ['grossing movies', 'most streamed songs', 'most followed instagram accounts', 'most visited countries', 'espn athletes', 'most popular boy names', 'most popular girl names', 'companies by market cap', 'most common words', 'video games', 'most streamed artists', 'universities', 'most popular anime', 'most populated cities'] as const 
// const AVAILABLE_CATEGORIES = ['most popular girl names'] as const 

export type Category = typeof AVAILABLE_CATEGORIES[number]

interface RankResult {
  rank: number
  title: string
  aliases: string[]
  isMatch: boolean
  guessCount: number
}

interface DbItem {
  rank: number
  title: string
  aliases: string[]
}

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  'grossing movies': 'movies',
  'most streamed songs': 'songs',
  'most followed instagram accounts': 'instagram accounts',
  'most visited countries': 'most visited countries',
  'espn athletes': 'athletes',
  'most popular boy names': 'boy names',
  'most popular girl names': 'girl names',
  'companies by market cap': 'companies',
  'most common words': 'common words',
  'video games': 'video games',
  'most streamed artists': 'artists',
  'universities': 'universities',
  'most popular anime': 'anime',
  'most populated cities': 'cities'
}

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getGuessCount } = useGuessStats()

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkRank = useCallback(async (title: string, category: Category, previousGuesses: string[] = [], retryCount = 0): Promise<RankResult> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from(category)
        .select('rank, title, aliases')
        .order('rank', { ascending: true })
        .limit(101)

      if (error) {
        if (error.message.includes('API key') && retryCount < MAX_RETRIES) {
          await sleep(RETRY_DELAY)
          return checkRank(title, category, previousGuesses, retryCount + 1)
        }
        throw error
      }

      if (!data) return { rank: 0, title: title, aliases: [], isMatch: false, guessCount: 0 }

      // First check for exact title matches
      const exactMatches = data.filter((item: DbItem) => 
        isTitleMatch(title, item.title)
      )

      // Then check aliases only if no exact matches found
      const matches = exactMatches.length > 0 ? exactMatches : data.filter((item: DbItem) => 
        item.aliases.some(alias => isTitleMatch(title, alias))
      )

      if (matches.length === 0) {
        return { rank: 0, title: title, aliases: [], isMatch: false, guessCount: 0 }
      }

      // Filter out previously guessed titles
      const unguessedMatches = matches.filter(match =>
        !previousGuesses.some(prevGuess => 
          isTitleMatch(match.title, prevGuess)
        )
      )

      // If no unguessed matches, return as failed guess
      if (unguessedMatches.length === 0) {
        return { rank: 0, title: title, aliases: [], isMatch: false, guessCount: 0 }
      }

      // Return the highest ranked (lowest number) unguessed match with guess count
      const match = unguessedMatches[0]
      const guessCount = await getGuessCount(match.title, category)
      return { 
        rank: match.rank, 
        title: match.title,
        aliases: match.aliases,
        isMatch: true,
        guessCount
      }
    } catch (err) {
      if (isSupabaseError(err)) {
        setError(`Database error" ${err.message}`)
        console.error('Supabase error:', {
          message: err.message,
          details: err.details,
          hint: err.hint
        })
      } else {
        setError('An unexpected error occurred')
        console.error('Unknown error', err)
      }
      return { rank: 0, title: title, aliases: [], isMatch: false, guessCount: 0 }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getRandomCategory = useCallback((): Category => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_CATEGORIES.length)
    return AVAILABLE_CATEGORIES[randomIndex]
  }, [])

  return {
    checkRank,
    getRandomCategory,
    isLoading,
    error
  }
}