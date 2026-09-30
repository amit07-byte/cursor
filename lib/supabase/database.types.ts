export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          display_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          display_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          city: string | null
          category: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          city?: string | null
          category?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          city?: string | null
          category?: string | null
          description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          id: string
          user_id: string
          city: string | null
          niches: string[]
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city?: string | null
          niches?: string[]
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          niches?: string[]
          bio?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          id: string
          business_id: string
          title: string
          description: string | null
          category: string | null
          city: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          description?: string | null
          category?: string | null
          city?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          category?: string | null
          city?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          deadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      campaign_requirements: {
        Row: {
          id: string
          campaign_id: string
          description: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          description: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          description?: string
          sort_order?: number
        }
        Relationships: []
      }
      applications: {
        Row: {
          id: string
          campaign_id: string
          creator_id: string
          message: string | null
          status: Database["public"]["Enums"]["application_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          creator_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          url?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          read_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "BUSINESS" | "CREATOR"
      campaign_status: "draft" | "published" | "closed"
      application_status: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
