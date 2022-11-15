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
      account: {
        Row: {
          account_id: number
          username: string | null
          password: string | null
          account_type: string | null
          fname: string | null
          lname: string | null
          email: string | null
        }
        Insert: {
          account_id?: number
          username?: string | null
          password?: string | null
          account_type?: string | null
          fname?: string | null
          lname?: string | null
          email?: string | null
        }
        Update: {
          account_id?: number
          username?: string | null
          password?: string | null
          account_type?: string | null
          fname?: string | null
          lname?: string | null
          email?: string | null
        }
      }
      favorited_schools: {
        Row: {
          fav_school_id: number
          school_id: number
          account_id: number
        }
        Insert: {
          fav_school_id?: number
          school_id: number
          account_id: number
        }
        Update: {
          fav_school_id?: number
          school_id?: number
          account_id?: number
        }
      }
      grade: {
        Row: {
          grade_id: number
          school_id: number
          account_id: number
          grade_num: number | null
          financial_aid: number | null
          in_out_loc: string | null
        }
        Insert: {
          grade_id?: number
          school_id: number
          account_id: number
          grade_num?: number | null
          financial_aid?: number | null
          in_out_loc?: string | null
        }
        Update: {
          grade_id?: number
          school_id?: number
          account_id?: number
          grade_num?: number | null
          financial_aid?: number | null
          in_out_loc?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      saved_grades: {
        Row: {
          saved_grade_id: number
          grade_id: number
          account_id: number
        }
        Insert: {
          saved_grade_id?: number
          grade_id: number
          account_id: number
        }
        Update: {
          saved_grade_id?: number
          grade_id?: number
          account_id?: number
        }
      }
      school: {
        Row: {
          school_id: number
          api_id: number | null
          school_name: string | null
          city: string | null
          zip: number | null
          website: string | null
          net_price_calculator_link: string | null
          in_state_tuition: unknown | null
          out_state_tuition: unknown | null
          net_instate: unknown | null
          net_outstate: unknown | null
        }
        Insert: {
          school_id?: number
          api_id?: number | null
          school_name?: string | null
          city?: string | null
          zip?: number | null
          website?: string | null
          net_price_calculator_link?: string | null
          in_state_tuition?: unknown | null
          out_state_tuition?: unknown | null
          net_instate?: unknown | null
          net_outstate?: unknown | null
        }
        Update: {
          school_id?: number
          api_id?: number | null
          school_name?: string | null
          city?: string | null
          zip?: number | null
          website?: string | null
          net_price_calculator_link?: string | null
          in_state_tuition?: unknown | null
          out_state_tuition?: unknown | null
          net_instate?: unknown | null
          net_outstate?: unknown | null
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
