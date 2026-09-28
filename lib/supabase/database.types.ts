export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      athletes: {
        Row: {
          birth_date: string | null
          created_at: string
          full_name: string
          id: string
          organization_id: string
          position: string | null
          sport: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          full_name: string
          id?: string
          organization_id: string
          position?: string | null
          sport?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          full_name?: string
          id?: string
          organization_id?: string
          position?: string | null
          sport?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athletes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          instructions: string | null
          name: string
          organization_id: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          instructions?: string | null
          name: string
          organization_id: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          instructions?: string | null
          name?: string
          organization_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_library_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          athlete_id: string | null
          bucket_path: string
          created_at: string
          created_by: string
          exercise_id: string | null
          file_name: string
          id: string
          mime_type: string
          organization_id: string
          size_bytes: number
        }
        Insert: {
          athlete_id?: string | null
          bucket_path: string
          created_at?: string
          created_by: string
          exercise_id?: string | null
          file_name: string
          id?: string
          mime_type: string
          organization_id: string
          size_bytes: number
        }
        Update: {
          athlete_id?: string | null
          bucket_path?: string
          created_at?: string
          created_by?: string
          exercise_id?: string | null
          file_name?: string
          id?: string
          mime_type?: string
          organization_id?: string
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          organization_id: string
          role: string
          user_id: string
        }
        Update: {
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          athlete_id: string | null
          body: string
          created_at: string
          id: string
          organization_id: string
          read_at: string | null
          recipient_user_id: string
          sender_user_id: string
        }
        Insert: {
          athlete_id?: string | null
          body: string
          created_at?: string
          id?: string
          organization_id: string
          read_at?: string | null
          recipient_user_id: string
          sender_user_id: string
        }
        Update: {
          athlete_id?: string | null
          body?: string
          created_at?: string
          id?: string
          organization_id?: string
          read_at?: string | null
          recipient_user_id?: string
          sender_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_assessments: {
        Row: {
          assessed_at: string
          athlete_id: string
          bmi: number | null
          body_fat_pct: number | null
          calorie_target: number | null
          height_cm: number | null
          id: string
          muscle_pct: number | null
          notes: string | null
          recorded_by: string | null
          visceral_fat: number | null
          weight_kg: number | null
        }
        Insert: {
          assessed_at: string
          athlete_id: string
          bmi?: number | null
          body_fat_pct?: number | null
          calorie_target?: number | null
          height_cm?: number | null
          id?: string
          muscle_pct?: number | null
          notes?: string | null
          recorded_by?: string | null
          visceral_fat?: number | null
          weight_kg?: number | null
        }
        Update: {
          assessed_at?: string
          athlete_id?: string
          bmi?: number | null
          body_fat_pct?: number | null
          calorie_target?: number | null
          height_cm?: number | null
          id?: string
          muscle_pct?: number | null
          notes?: string | null
          recorded_by?: string | null
          visceral_fat?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_assessments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      physical_test_definitions: {
        Row: {
          category: string | null
          higher_is_better: boolean | null
          id: string
          name: string
          organization_id: string
          unit: string | null
        }
        Insert: {
          category?: string | null
          higher_is_better?: boolean | null
          id?: string
          name: string
          organization_id: string
          unit?: string | null
        }
        Update: {
          category?: string | null
          higher_is_better?: boolean | null
          id?: string
          name?: string
          organization_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_test_definitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_test_results: {
        Row: {
          athlete_id: string
          id: string
          measured_at: string
          notes: string | null
          numeric_value: number | null
          recorded_by: string | null
          test_id: string
          text_value: string | null
        }
        Insert: {
          athlete_id: string
          id?: string
          measured_at: string
          notes?: string | null
          numeric_value?: number | null
          recorded_by?: string | null
          test_id: string
          text_value?: string | null
        }
        Update: {
          athlete_id?: string
          id?: string
          measured_at?: string
          notes?: string | null
          numeric_value?: number | null
          recorded_by?: string | null
          test_id?: string
          text_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_test_results_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "physical_test_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      physio_notes: {
        Row: {
          assessed_at: string
          athlete_id: string
          availability: string | null
          body_area: string | null
          id: string
          pain_score: number | null
          private_note: string | null
          recorded_by: string | null
          restriction_summary: string | null
        }
        Insert: {
          assessed_at?: string
          athlete_id: string
          availability?: string | null
          body_area?: string | null
          id?: string
          pain_score?: number | null
          private_note?: string | null
          recorded_by?: string | null
          restriction_summary?: string | null
        }
        Update: {
          assessed_at?: string
          athlete_id?: string
          availability?: string | null
          body_area?: string | null
          id?: string
          pain_score?: number | null
          private_note?: string | null
          recorded_by?: string | null
          restriction_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physio_notes_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_cycles: {
        Row: {
          athlete_id: string
          created_at: string
          created_by: string
          ends_on: string
          id: string
          organization_id: string
          plan_data: Json
          starts_on: string
          status: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          athlete_id: string
          created_at?: string
          created_by: string
          ends_on: string
          id?: string
          organization_id: string
          plan_data?: Json
          starts_on: string
          status?: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          athlete_id?: string
          created_at?: string
          created_by?: string
          ends_on?: string
          id?: string
          organization_id?: string
          plan_data?: Json
          starts_on?: string
          status?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "planning_cycles_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_exercises: {
        Row: {
          distance_m: number | null
          duration_sec: number | null
          exercise_id: string | null
          exercise_name: string
          id: string
          intensity_pct: number | null
          notes: string | null
          reps: string | null
          rest_sec: number | null
          session_id: string
          sets: number | null
          sort_order: number
        }
        Insert: {
          distance_m?: number | null
          duration_sec?: number | null
          exercise_id?: string | null
          exercise_name: string
          id?: string
          intensity_pct?: number | null
          notes?: string | null
          reps?: string | null
          rest_sec?: number | null
          session_id: string
          sets?: number | null
          sort_order?: number
        }
        Update: {
          distance_m?: number | null
          duration_sec?: number | null
          exercise_id?: string | null
          exercise_name?: string
          id?: string
          intensity_pct?: number | null
          notes?: string | null
          reps?: string | null
          rest_sec?: number | null
          session_id?: string
          sets?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_feedback: {
        Row: {
          actual_duration_min: number | null
          actual_rpe: number | null
          athlete_id: string
          comment: string | null
          completed_at: string
          fatigue: number | null
          id: string
          pain: number | null
          session_id: string
          soreness: number | null
        }
        Insert: {
          actual_duration_min?: number | null
          actual_rpe?: number | null
          athlete_id: string
          comment?: string | null
          completed_at?: string
          fatigue?: number | null
          id?: string
          pain?: number | null
          session_id: string
          soreness?: number | null
        }
        Update: {
          actual_duration_min?: number | null
          actual_rpe?: number | null
          athlete_id?: string
          comment?: string | null
          completed_at?: string
          fatigue?: number | null
          id?: string
          pain?: number | null
          session_id?: string
          soreness?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          athlete_id: string
          coach_user_id: string | null
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          scheduled_for: string
          session_type: string | null
          status: string
          target_duration_min: number | null
          target_rpe: number | null
          title: string
        }
        Insert: {
          athlete_id: string
          coach_user_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          scheduled_for: string
          session_type?: string | null
          status?: string
          target_duration_min?: number | null
          target_rpe?: number | null
          title: string
        }
        Update: {
          athlete_id?: string
          coach_user_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          scheduled_for?: string
          session_type?: string | null
          status?: string
          target_duration_min?: number | null
          target_rpe?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_checkins: {
        Row: {
          athlete_id: string
          checkin_date: string
          fatigue: number | null
          id: string
          notes: string | null
          pain: number | null
          sleep_hours: number | null
          sleep_quality: number | null
          soreness: number | null
          stress: number | null
        }
        Insert: {
          athlete_id: string
          checkin_date?: string
          fatigue?: number | null
          id?: string
          notes?: string | null
          pain?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
        }
        Update: {
          athlete_id?: string
          checkin_date?: string
          fatigue?: number | null
          id?: string
          notes?: string | null
          pain?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wellness_checkins_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


