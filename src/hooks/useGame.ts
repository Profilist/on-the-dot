import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'anonymous_user_id'

export function useGame() {
  const [userId, setUserId] = useState<string | null>(null)

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

  return { userId, initializeUser }
} 