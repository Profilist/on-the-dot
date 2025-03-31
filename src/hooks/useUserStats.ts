import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Guess } from '../types/game'
import type { Database } from '../types/supabase'

type UserStats = Database['public']['Tables']['user_stats']['Row']

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [categoryStats, setCategoryStats] = useState<{ averageScore: number }>({ averageScore: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    
    // Load user stats
    const { data: userStats, error: userError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      setError(userError.message)
    } else if (!userStats) {
      // Create new stats record for user
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({
          id: userId,
          current_streak: 0,
          max_streak: 0,
          total_plays: 0,
          last_played_at: null
        })
        .select()
        .single()

      if (createError) {
        setError(createError.message)
      } else if (newStats) {
        setStats(newStats)
      }
    } else {
      setStats(userStats)
    }

    setIsLoading(false)
  }, [userId])

  const loadCategoryStats = useCallback(async (category: string) => {
    if (!category) return

    const { data, error } = await supabase
      .from('plays')
      .select('score')
      .eq('category', category)

    if (error) {
      setError(error.message)
      return
    }

    if (data && data.length > 0) {
      const totalScore = data.reduce((sum, play) => sum + play.score, 0)
      const average = Math.round(totalScore / data.length)
      setCategoryStats({ averageScore: average })
    } else {
      setCategoryStats({ averageScore: 0 })
    }
  }, [])

  const savePlay = useCallback(async (
    score: number,
    category: string,
    guesses: Guess[]
  ) => {
    if (!userId || !stats) return

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Save the play
    const { error: playError } = await supabase
      .from('plays')
      .insert({
        user_id: userId,
        category,
        score,
        guesses,
        played_at: now.toISOString()
      })

    if (playError) {
      setError(playError.message)
      return
    }

    // Calculate streak
    let newStreak = 1
    let newMaxStreak = stats.max_streak

    if (stats.last_played_at) {
      const lastPlayed = new Date(stats.last_played_at)
      const lastPlayedDay = new Date(lastPlayed.getFullYear(), lastPlayed.getMonth(), lastPlayed.getDate())
      const dayDiff = Math.floor((today.getTime() - lastPlayedDay.getTime()) / (1000 * 60 * 60 * 24))

      if (dayDiff === 1) {
        // Consecutive day
        newStreak = stats.current_streak + 1
        newMaxStreak = Math.max(newStreak, stats.max_streak)
      } else if (dayDiff === 0) {
        // Same day, keep current streak
        newStreak = stats.current_streak
      }
      // If dayDiff > 1, streak resets to 1 (already set above)
    }

    // Update user stats
    const { data: updatedStats, error: statsError } = await supabase
      .from('user_stats')
      .update({
        current_streak: newStreak,
        max_streak: newMaxStreak,
        total_plays: stats.total_plays + 1,
        last_played_at: now.toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (statsError) {
      setError(statsError.message)
      return
    }

    setStats(updatedStats)
    
    // Refresh category stats
    await loadCategoryStats(category)
  }, [userId, stats, loadCategoryStats])

  return { stats, categoryStats, isLoading, error, loadStats, loadCategoryStats, savePlay }
}