import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'anonymous_user_id'

export function useAnonymousId() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Try to get existing ID from localStorage
    let id = localStorage.getItem(USER_ID_KEY)
    
    // If no ID exists, create one
    if (!id) {
      id = uuidv4()
      localStorage.setItem(USER_ID_KEY, id)
    }
    
    setUserId(id)
  }, [])

  return userId
} 