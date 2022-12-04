export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favorited_schools: {
        Row: {
          fav_school_id: number
          school_id: number
          account_id: string | null
        }
        Insert: {
          fav_school_id?: number
          school_id: number
          account_id?: string | null
        }
        Update: {
          fav_school_id?: number
          school_id?: number
          account_id?: string | null
        }
      }
      grade: {
        Row: {
          grade_id: number
          school_id: number
          grade_num: number
          financial_aid: number
          in_out_loc: string
          account_id: string | null
        }
        Insert: {
          grade_id?: number
          school_id: number
          grade_num: number
          financial_aid: number
          in_out_loc: string
          account_id?: string | null
        }
        Update: {
          grade_id?: number
          school_id?: number
          grade_num?: number
          financial_aid?: number
          in_out_loc?: string
          account_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          email: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      saved_grades: {
        Row: {
          saved_grade_id: number
          grade_id: number
          account_id: string
        }
        Insert: {
          saved_grade_id?: number
          grade_id: number
          account_id: string
        }
        Update: {
          saved_grade_id?: number
          grade_id?: number
          account_id?: string
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
