import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Guess } from '../types/game'
import type { Database } from '../types/supabase'

type UserStats = Database['public']['Tables']['user_stats']['Row']

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [categoryStats, setCategoryStats] = useState<{ 
    scoreDistribution: number[],
    totalPlays: number,
    totalScore: number
  }>({ 
    scoreDistribution: [],
    totalPlays: 0,
    totalScore: 0
  })
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
          total_score: 0,
          last_played_at: new Date().toISOString()
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
      .lt('created_at', new Date().toISOString()) // Only get past plays
      .order('score', { ascending: true })

    if (error) {
      setError(error.message)
      return
    }

    if (data && data.length > 0) {
      const scores = data.map(play => play.score)
      const totalScore = scores.reduce((sum, score) => sum + score, 0)
      
      setCategoryStats({ 
        scoreDistribution: scores,
        totalPlays: scores.length,
        totalScore: totalScore
      })
    } else {
      setCategoryStats({ 
        scoreDistribution: [],
        totalPlays: 0,
        totalScore: 0
      })
    }
  }, [])

  const savePlay = useCallback(async (
    score: number,
    category: string,
    guesses: Guess[]
  ) => {
    if (!userId) return

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Save the play
    const { error: playError } = await supabase
      .from('plays')
      .insert({
        user_id: userId,
        category,
        score: score.toString(),
        guesses,
        created_at: now.toISOString()
      })

    if (playError) {
      console.error('Error saving play:', playError)
      setError(playError.message)
      return
    }

    // Calculate streak and stats
    let newStreak = 1  // Default to 1 for first play or broken streak
    let newMaxStreak = stats?.max_streak || 0
    let totalPlays = (stats?.total_plays || 0) + 1
    let totalScore = (stats?.total_score || 0) + score

    if (stats?.last_played_at) {
      const lastPlayed = new Date(stats.last_played_at)
      const lastPlayedDay = new Date(lastPlayed.getFullYear(), lastPlayed.getMonth(), lastPlayed.getDate())
      const dayDiff = Math.floor((today.getTime() - lastPlayedDay.getTime()) / (1000 * 60 * 60 * 24))

      if (dayDiff === 1) {
        // Consecutive day
        newStreak = (stats.current_streak || 0) + 1
      } else if (dayDiff === 0) {
        // Same day, keep current streak but ensure it's at least 1
        newStreak = Math.max(1, stats.current_streak || 0)
      }
      // If dayDiff > 1, streak resets to 1 (already set above)
    }
    
    // Update max streak if current streak is higher
    newMaxStreak = Math.max(newStreak, newMaxStreak)

    // Update user stats
    const newStats = {
      id: userId,
      current_streak: newStreak,
      max_streak: newMaxStreak,
      total_plays: totalPlays,
      total_score: totalScore,
      last_played_at: now.toISOString()
    }

    // Create or update user stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .upsert(newStats)

    if (statsError) {
      console.error('Error updating stats:', statsError)
      setError(statsError.message)
      return
    }

    // Update local state with new stats
    setStats({
      ...newStats,
      created_at: stats?.created_at || now.toISOString()
    })

    // Also update category stats
    setCategoryStats(prev => ({
      ...prev,
      totalPlays: prev.totalPlays + 1,
      totalScore: prev.totalScore + score,
      scoreDistribution: [...prev.scoreDistribution, score]
    }))

  }, [userId, stats])

  return { stats, categoryStats, isLoading, error, loadStats, loadCategoryStats, savePlay }
}