import { useState, useCallback } from 'react'
import { supabase, isSupabaseError } from '../lib/supabase'
import { normalizeTitle } from '../utils/titleMatcher'

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second
const AVAILABLE_CATEGORIES = ['movies', 'songs', 'instagram accounts'] as const // Add more categories as they become available

export type Category = typeof AVAILABLE_CATEGORIES[number]

interface RankResult {
  rank: number
  title: string
}

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkRank = useCallback(async (title: string, category: Category, retryCount = 0): Promise<RankResult | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get all titles for fuzzy matching
      const { data, error } = await supabase
        .from(category)
        .select('rank, title')
        .order('rank', { ascending: true }) // Important for getting the most relevant match first
        .limit(100) // Get all top 100 items

      if (error) {
        if (error.message.includes('API key') && retryCount < MAX_RETRIES) {
          await sleep(RETRY_DELAY)
          return checkRank(title, category, retryCount + 1)
        }
        throw error
      }

      if (!data) return null

      // Find the best match using normalized comparison
      const normalizedGuess = normalizeTitle(title)
      const match = data.find(item => {
        const normalizedTitle = normalizeTitle(item.title)
        return normalizedTitle.includes(normalizedGuess) || normalizedGuess.includes(normalizedTitle)
      })

      return match ? { rank: match.rank, title: match.title } : null
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
      return null
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