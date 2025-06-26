import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'apikey': supabaseKey
      }
    }
  }
)

export function isSupabaseError(error: unknown): error is { message: string; details: string; hint: string; code: string } {
  return typeof error === 'object' && error !== null && 'message' in error && 'code' in error
}