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
      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase.rpc('increment_guess_count', {
        p_title: title,
        p_category: category
      })

      // If the record doesn't exist, create it
      if (updateError?.code === 'PGRST116' || (!updateData && !updateError)) {
        console.log('No existing record found, creating new one for:', title, category)
        const { error: insertError } = await supabase
          .from('guess_counts')
          .insert({ 
            title, 
            category, 
            count: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          throw insertError
        }
      } else if (updateError) {
        throw updateError
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
