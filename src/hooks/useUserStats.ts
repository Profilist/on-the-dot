import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Guess } from '../types/game'
import type { Database } from '../types/supabase'

type UserStats = Database['public']['Tables']['user_stats']['Row']

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setStats(data)
    } else {
      // Create new stats record for user
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({
          id: userId,
          current_streak: 0,
          max_streak: 0,
          total_plays: 0,
          average_score: 0
        })
        .select()
        .single()

      if (createError) {
        setError(createError.message)
      } else if (newStats) {
        setStats(newStats)
      }
    }

    setIsLoading(false)
  }, [userId])

  const savePlay = useCallback(async (
    category: string,
    score: number,
    guesses: Guess[]
  ) => {
    if (!userId || !stats) return

    // Start a transaction to update both plays and stats
    const { data: play, error: playError } = await supabase
      .from('plays')
      .insert({
        user_id: userId,
        category,
        score,
        guesses
      })
      .select()
      .single()

    if (playError) {
      setError(playError.message)
      return
    }

    // Calculate new stats
    const newAverage = ((stats.average_score * stats.total_plays) + score) / (stats.total_plays + 1)
    const lastPlayDate = new Date(stats.last_played_at || 0)
    const isConsecutiveDay = 
      new Date().setHours(0, 0, 0, 0) - lastPlayDate.setHours(0, 0, 0, 0) <= 86400000

    const newStats = {
      total_plays: stats.total_plays + 1,
      average_score: newAverage,
      current_streak: isConsecutiveDay ? stats.current_streak + 1 : 1,
      max_streak: Math.max(stats.max_streak, isConsecutiveDay ? stats.current_streak + 1 : 1),
      last_played_at: new Date().toISOString()
    }

    const { error: statsError } = await supabase
      .from('user_stats')
      .update(newStats)
      .eq('id', userId)

    if (statsError) {
      setError(statsError.message)
      return
    }

    setStats({ ...stats, ...newStats })
  }, [userId, stats])

  return {
    stats,
    isLoading,
    error,
    loadStats,
    savePlay
  }
} 