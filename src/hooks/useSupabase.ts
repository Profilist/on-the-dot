import { useState, useCallback } from 'react'
import { supabase, isSupabaseError } from '../lib/supabase'
import { normalizeTitle } from '../utils/titleMatcher'

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second
const AVAILABLE_CATEGORIES = ['grossing movies', 'most streamed songs', 'most followed instagram accounts', 'most visited countries', 'ESPN athletes', 'most popular boy names', 'most popular girl names', 'companies by market cap', 'most common words'] as const 
// const AVAILABLE_CATEGORIES = ['most popular girl names'] as const 

export type Category = typeof AVAILABLE_CATEGORIES[number]

interface RankResult {
  rank: number
  title: string
  aliases: string[]
  isMatch: boolean
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
  'ESPN athletes': 'athletes',
  'most popular boy names': 'boy names',
  'most popular girl names': 'girl names',
  'companies by market cap': 'companies',
  'most common words': 'common words'
}

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      if (!data) return { rank: 0, title: title, aliases: [], isMatch: false }

      const normalizedGuess = normalizeTitle(title)
      
      // Find all items that match the guess through their aliases
      const matches = data.filter((item: DbItem) => 
        item.aliases.some(alias => normalizeTitle(alias) === normalizedGuess)
      )

      if (matches.length === 0) {
        return { rank: 0, title: title, aliases: [], isMatch: false }
      }

      // Filter out previously guessed titles
      const unguessedMatches = matches.filter(match =>
        !previousGuesses.some(prevGuess => 
          normalizeTitle(match.title) === normalizeTitle(prevGuess)
        )
      )

      // If no unguessed matches, return as failed guess
      if (unguessedMatches.length === 0) {
        return { rank: 0, title: title, aliases: [], isMatch: false }
      }

      // Return the highest ranked (lowest number) unguessed match
      const match = unguessedMatches[0]
      return { 
        rank: match.rank, 
        title: match.title,
        aliases: match.aliases,
        isMatch: true
      }
    } catch (err) {
      if (isSupabaseError(err)) {
        setError(`Database error" ${err.message}`)
        console.error('Supasbase error:', {
          message: err.message,
          details: err.details,
          hint: err.hint
        })
      } else {
        setError('An unexpected error occurred')
        console.error('Unknown error', err)
      }
      return { rank: 0, title: title, aliases: [], isMatch: false }
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