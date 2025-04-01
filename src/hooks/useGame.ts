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

  // Handle game finish
  const handleGameFinish = useCallback(async (
    _category: string,
    _guesses: Guess[]
  ) => {
    if (!userId) return false
    return true
  }, [userId])

  return {
    userId,
    stats,
    initializeUser,
    loadStats,
    handleGameFinish
  }
} 