import { useState, useCallback } from 'react'
import { supabase, isSupabaseError } from '../lib/supabase'
import type { Tables } from '../lib/supabase'

const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const checkMovieRank = useCallback(async (movieTitle: string, retryCount = 0): Promise<number | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('rank')
        .ilike('title', `%${movieTitle}%`) // More flexible matching
        .limit(1) // Optimize query
        .maybeSingle() // Better than .single() for our use case

      // Handle Supabase errors
      if (error) {
        // If it's an API key error and we haven't exceeded retries, try again
        if (error.message.includes('API key') && retryCount < MAX_RETRIES) {
          await sleep(RETRY_DELAY)
          return checkMovieRank(movieTitle, retryCount + 1)
        }
        throw error
      }

      return data?.rank ?? null
    } catch (err) {
      // Type-safe error handling
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

  return {
    checkMovieRank,
    isLoading,
    error
  }
} 