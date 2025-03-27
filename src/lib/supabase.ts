import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create typed client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false // Since we don't need auth for this game
    },
    global: {
      headers: {
        'apikey': supabaseKey
      }
    }
  }
)

// Type-safe helper for checking if an error is a Supabase error
export function isSupabaseError(error: unknown): error is { message: string; details: string; hint: string; code: string } {
  return typeof error === 'object' && error !== null && 'message' in error && 'code' in error
}

export type Tables = {
  movies: {
    id: number
    title: string
    rank: number
    category: string
    created_at: string
  }
} 