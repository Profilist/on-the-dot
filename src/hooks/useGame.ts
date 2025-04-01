import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Guess } from '../types/game'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'anonymous_user_id'

export function useGame() {
  const [userId, setUserId] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    current_streak: number
    max_streak: number
    total_plays: number
    total_score: number
    average_score: number
    last_played_at?: string
  } | null>(null)

  // Initialize or get existing user ID
  const initializeUser = useCallback(() => {
    let id = localStorage.getItem(USER_ID_KEY)
    if (!id) {
      id = uuidv4()
      localStorage.setItem(USER_ID_KEY, id)
    }
    setUserId(id)
    return id
  }, [])

  // Load user stats
  const loadStats = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Error loading stats:', error)
      return
    }

    if (data) {
      setStats(data)
    } else {
      // Create new stats record
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({
          id,
          current_streak: 0,
          max_streak: 0,
          total_plays: 0,
          average_score: 0,
          last_played_at: new Date().toISOString()
        })
        .select()
        .maybeSingle()

      if (createError) {
        console.error('Error creating stats:', createError)
        return
      }

      if (newStats) {
        setStats(newStats)
      }
    }
  }, [])

  // Calculate score based on guesses
  const calculateScore = useCallback((guesses: Guess[]): number => {
    return guesses.reduce((score, guess) => {
      if (!guess.rank) return score
      const distance = Math.abs(100 - guess.rank)
      return score + Math.max(0, 100 - distance)
    }, 0)
  }, [])

  // Handle game finish
  const handleGameFinish = useCallback(async (
    category: string,
    guesses: Guess[]
  ) => {
    if (!userId) return

    const score = calculateScore(guesses)
    const now = new Date()
    const lastPlayDate = stats?.last_played_at 
      ? new Date(stats.last_played_at)
      : null

    // Check if this is a consecutive day
    const isConsecutiveDay = lastPlayDate && 
      now.setHours(0, 0, 0, 0) - lastPlayDate.setHours(0, 0, 0, 0) <= 86400000

    // Save the play
    const { error: playError } = await supabase
      .from('plays')
      .insert({
        user_id: userId,
        category,
        score: score.toString(),
        guesses
      })

    if (playError) {
      console.error('Error saving play:', playError)
      return
    }

    // Update stats
    const newStats = {
      total_plays: (stats?.total_plays || 0) + 1,
      total_score: (stats?.total_score || 0) + score,
      average_score: ((stats?.average_score || 0) * (stats?.total_plays || 0) + score) / ((stats?.total_plays || 0) + 1),
      current_streak: isConsecutiveDay ? (stats?.current_streak || 0) + 1 : 1,
      max_streak: Math.max(stats?.max_streak || 0, isConsecutiveDay ? (stats?.current_streak || 0) + 1 : 1),
      last_played_at: now.toISOString()
    }

    const { error: statsError } = await supabase
      .from('user_stats')
      .update(newStats)
      .eq('id', userId)

    if (statsError) {
      console.error('Error updating stats:', statsError)
      return
    }

    setStats(newStats)
    return { score, stats: newStats }
  }, [userId, stats, calculateScore])

  return {
    userId,
    stats,
    initializeUser,
    loadStats,
    handleGameFinish
  }
} 