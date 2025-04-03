import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from './useSupabase'

export function useGuessStats() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getGuessCount = useCallback(async (title: string, category: Category): Promise<number> => {
    title = title.toLowerCase()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('guess_counts')
        .select('count')
        .eq('title', title)
        .eq('category', category)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data?.count || 0
    } catch (err: any) {
      setError(err.message)
      return 0
    } finally {
      setIsLoading(false)
    }
  }, [])

  const incrementGuessCount = useCallback(async (title: string, category: Category): Promise<void> => {
    title = title.toLowerCase()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.rpc('increment_guess_count', {
        p_title: title,
        p_category: category,
        p_created_at: new Date().toISOString(),
        p_updated_at: new Date().toISOString()
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      console.error('Error in incrementGuessCount:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getGuessCount,
    incrementGuessCount,
    isLoading,
    error
  }
}
