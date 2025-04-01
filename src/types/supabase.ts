import type { Guess } from './game'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rankings: {
        Row: {
          id: number
          title: string
          rank: number
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          rank: number
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          rank?: number
          category?: string
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string  // UUID for anonymous user
          current_streak: number
          max_streak: number
          total_plays: number
          total_score: number
          last_played_at: string
          created_at: string
        }
        Insert: {
          id: string
          current_streak?: number
          max_streak?: number
          total_plays?: number
          total_score?: number
          last_played_at?: string
          created_at?: string
        }
        Update: {
          current_streak?: number
          max_streak?: number
          total_plays?: number
          total_score?: number
          last_played_at?: string
        }
      }
      plays: {
        Row: {
          id: number
          user_id: string
          category: string
          score: number
          guesses: Guess[]
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          category: string
          score: number
          guesses: Guess[]
          created_at?: string
        }
        Update: {
          score?: number
          guesses?: Guess[]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 