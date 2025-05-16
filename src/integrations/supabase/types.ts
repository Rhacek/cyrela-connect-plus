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
      leads: {
        Row: {
          assigned_to_id: string | null
          budget: number | null
          created_at: string
          created_by_id: string
          desired_location: string | null
          email: string
          id: string
          is_manual: boolean
          name: string
          notes: string | null
          phone: string
          preferred_bathrooms: number | null
          preferred_bedrooms: number | null
          property_id: string | null
          source: string
          status: string
          target_move_date: string | null
          updated_at: string
        }
        Insert: {
          assigned_to_id?: string | null
          budget?: number | null
          created_at?: string
          created_by_id: string
          desired_location?: string | null
          email: string
          id?: string
          is_manual?: boolean
          name: string
          notes?: string | null
          phone: string
          preferred_bathrooms?: number | null
          preferred_bedrooms?: number | null
          property_id?: string | null
          source: string
          status: string
          target_move_date?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to_id?: string | null
          budget?: number | null
          created_at?: string
          created_by_id?: string
          desired_location?: string | null
          email?: string
          id?: string
          is_manual?: boolean
          name?: string
          notes?: string | null
          phone?: string
          preferred_bathrooms?: number | null
          preferred_bedrooms?: number | null
          property_id?: string | null
          source?: string
          status?: string
          target_move_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      performance: {
        Row: {
          broker_id: string
          id: string
          leads: number
          month: number
          sales: number
          schedules: number
          shares: number
          visits: number
          year: number
        }
        Insert: {
          broker_id: string
          id?: string
          leads?: number
          month: number
          sales?: number
          schedules?: number
          shares?: number
          visits?: number
          year: number
        }
        Update: {
          broker_id?: string
          id?: string
          leads?: number
          month?: number
          sales?: number
          schedules?: number
          shares?: number
          visits?: number
          year?: number
        }
        Relationships: []
      }
      plans: {
        Row: {
          billing_period: string | null
          description: string
          features: Json
          id: string
          is_active: boolean
          is_most_popular: boolean | null
          name: string
          price: number
          type: string | null
        }
        Insert: {
          billing_period?: string | null
          description: string
          features: Json
          id?: string
          is_active?: boolean
          is_most_popular?: boolean | null
          name: string
          price: number
          type?: string | null
        }
        Update: {
          billing_period?: string | null
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          is_most_popular?: boolean | null
          name?: string
          price?: number
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          broker_code: string | null
          brokerage: string | null
          budget: number | null
          city: string | null
          company: string | null
          created_at: string
          creci: string | null
          desired_location: string | null
          email: string
          id: string
          name: string
          phone: string | null
          preferred_bathrooms: number | null
          preferred_bedrooms: number | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
          zone: string | null
        }
        Insert: {
          broker_code?: string | null
          brokerage?: string | null
          budget?: number | null
          city?: string | null
          company?: string | null
          created_at?: string
          creci?: string | null
          desired_location?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          preferred_bathrooms?: number | null
          preferred_bedrooms?: number | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          zone?: string | null
        }
        Update: {
          broker_code?: string | null
          brokerage?: string | null
          budget?: number | null
          city?: string | null
          company?: string | null
          created_at?: string
          creci?: string | null
          desired_location?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          preferred_bathrooms?: number | null
          preferred_bedrooms?: number | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          zone?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          broker_notes: string | null
          city: string
          commission: number | null
          construction_stage: string | null
          created_at: string
          created_by_id: string
          description: string
          development_name: string | null
          id: string
          is_active: boolean
          is_highlighted: boolean
          latitude: number | null
          longitude: number | null
          neighborhood: string
          parking_spaces: number
          price: number
          promotional_price: number | null
          share_count: number
          state: string
          suites: number
          title: string
          type: string
          updated_at: string
          view_count: number
          youtube_url: string | null
          zip_code: string
        }
        Insert: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          broker_notes?: string | null
          city: string
          commission?: number | null
          construction_stage?: string | null
          created_at?: string
          created_by_id: string
          description: string
          development_name?: string | null
          id?: string
          is_active?: boolean
          is_highlighted?: boolean
          latitude?: number | null
          longitude?: number | null
          neighborhood: string
          parking_spaces: number
          price: number
          promotional_price?: number | null
          share_count?: number
          state: string
          suites: number
          title: string
          type: string
          updated_at?: string
          view_count?: number
          youtube_url?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          area?: number
          bathrooms?: number
          bedrooms?: number
          broker_notes?: string | null
          city?: string
          commission?: number | null
          construction_stage?: string | null
          created_at?: string
          created_by_id?: string
          description?: string
          development_name?: string | null
          id?: string
          is_active?: boolean
          is_highlighted?: boolean
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          parking_spaces?: number
          price?: number
          promotional_price?: number | null
          share_count?: number
          state?: string
          suites?: number
          title?: string
          type?: string
          updated_at?: string
          view_count?: number
          youtube_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      property_images: {
        Row: {
          description: string | null
          id: string
          is_main: boolean
          order: number
          property_id: string
          url: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_main?: boolean
          order?: number
          property_id: string
          url: string
        }
        Update: {
          description?: string | null
          id?: string
          is_main?: boolean
          order?: number
          property_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          category: Database["public"]["Enums"]["settings_category"]
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: Database["public"]["Enums"]["settings_category"]
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: Database["public"]["Enums"]["settings_category"]
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      shares: {
        Row: {
          broker_id: string
          clicks: number
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          last_clicked_at: string | null
          notes: string | null
          property_id: string
          url: string
        }
        Insert: {
          broker_id: string
          clicks?: number
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_clicked_at?: string | null
          notes?: string | null
          property_id: string
          url: string
        }
        Update: {
          broker_id?: string
          clicks?: number
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_clicked_at?: string | null
          notes?: string | null
          property_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      targets: {
        Row: {
          broker_id: string
          id: string
          lead_target: number
          month: number
          sale_target: number
          schedule_target: number
          share_target: number
          visit_target: number
          year: number
        }
        Insert: {
          broker_id: string
          id?: string
          lead_target?: number
          month: number
          sale_target?: number
          schedule_target?: number
          share_target?: number
          visit_target?: number
          year: number
        }
        Update: {
          broker_id?: string
          id?: string
          lead_target?: number
          month?: number
          sale_target?: number
          schedule_target?: number
          share_target?: number
          visit_target?: number
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_broker_share_stats: {
        Args: { broker_id: string }
        Returns: {
          total_shares: number
          total_clicks: number
          active_links: number
          average_clicks_per_share: number
          most_shared_property: Json
        }[]
      }
      get_yearly_performance_summary: {
        Args: { broker_id: string }
        Returns: {
          year: number
          total_shares: number
          total_leads: number
          total_schedules: number
          total_visits: number
          total_sales: number
        }[]
      }
      increment_property_shares: {
        Args: { property_id: string }
        Returns: undefined
      }
      increment_property_views: {
        Args: { property_id: string }
        Returns: undefined
      }
      increment_share_clicks: {
        Args: { share_code: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_broker: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      settings_category: "general" | "email" | "features"
      user_role: "ADMIN" | "BROKER" | "CLIENT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      settings_category: ["general", "email", "features"],
      user_role: ["ADMIN", "BROKER", "CLIENT"],
    },
  },
} as const
