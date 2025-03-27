import { useState, useCallback } from 'react'
import { supabase, isSupabaseError } from '../lib/supabase'

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second
const AVAILABLE_CATEGORIES = ['movies'] as const // Add more categories as they become available

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkRank = useCallback(async (title: string, category: string, retryCount = 0): Promise<number | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('rank')
        .ilike('title', `%${title}%`)
        // .eq('category', category.toLowerCase())
        .limit(1)
        .maybeSingle()

      if (error) {
        if (error.message.includes('API key') && retryCount < MAX_RETRIES) {
          await sleep(RETRY_DELAY)
          return checkRank(title, category, retryCount + 1)
        }
        throw error
      }

      return data?.rank ?? null
    } catch (err) {
      if (isSupabaseError(err)) {
        setError(`Database error: ${err.message}`)
        console.error('Supabase error:', { 
          message: err.message, 
          details: err.details, 
          hint: err.hint 
        })
      } else {
        setError('An unexpected error occurred')
        console.error('Unknown error:', err)
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getRandomCategory = useCallback((): string => {
    // For now, just return 'movies' since that's our only category
    return AVAILABLE_CATEGORIES[0]
  }, [])

  return {
    checkRank,
    getRandomCategory,
    isLoading,
    error
  }
} 