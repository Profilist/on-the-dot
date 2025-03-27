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
      movies: {
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
          category?: string
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
    }
  }
} 