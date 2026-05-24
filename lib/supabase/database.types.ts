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
      ai_insights: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          input_summary: Json
          insight_kind: string
          markdown: string
          model: string | null
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          input_summary?: Json
          insight_kind: string
          markdown: string
          model?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          input_summary?: Json
          insight_kind?: string
          markdown?: string
          model?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          body: string | null
          created_at: string
          domain: string
          id: string
          metadata: Json
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          severity: Database["public"]["Enums"]["alert_severity"]
          signal_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          domain: string
          id?: string
          metadata?: Json
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          severity: Database["public"]["Enums"]["alert_severity"]
          signal_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          domain?: string
          id?: string
          metadata?: Json
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          severity?: Database["public"]["Enums"]["alert_severity"]
          signal_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_memberships: {
        Row: {
          created_at: string
          family_scope: Database["public"]["Enums"]["life_os_scope"]
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_scope?: Database["public"]["Enums"]["life_os_scope"]
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_scope?: Database["public"]["Enums"]["life_os_scope"]
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_checkup_metrics: {
        Row: {
          batch_id: string | null
          category: string | null
          created_at: string
          id: string
          measured_date: string | null
          metric_id: string
          metric_label: string
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          reference_range: string | null
          source: string | null
          value_numeric: number | null
          value_text: string | null
          year: number
        }
        Insert: {
          batch_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          measured_date?: string | null
          metric_id: string
          metric_label: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          reference_range?: string | null
          source?: string | null
          value_numeric?: number | null
          value_text?: string | null
          year: number
        }
        Update: {
          batch_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          measured_date?: string | null
          metric_id?: string
          metric_label?: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          reference_range?: string | null
          source?: string | null
          value_numeric?: number | null
          value_text?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_checkup_metrics_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      health_findings_actions: {
        Row: {
          batch_id: string | null
          category: string
          created_at: string
          dashboard_note: string | null
          id: string
          item: string
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          source: string | null
          status_or_value: string | null
          year: number
        }
        Insert: {
          batch_id?: string | null
          category: string
          created_at?: string
          dashboard_note?: string | null
          id?: string
          item: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          status_or_value?: string | null
          year: number
        }
        Update: {
          batch_id?: string | null
          category?: string
          created_at?: string
          dashboard_note?: string | null
          id?: string
          item?: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          status_or_value?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_findings_actions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      health_key_metrics: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          metric_id: string
          metric_label: string
          note: string | null
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          source: string | null
          unit: string | null
          value_numeric: number | null
          value_text: string | null
          year: number
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          metric_id: string
          metric_label: string
          note?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          year: number
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          metric_id?: string
          metric_label?: string
          note?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_key_metrics_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_holdings: {
        Row: {
          account: string | null
          batch_id: string | null
          cost_krw: number | null
          created_at: string
          gain_loss_krw: number | null
          id: string
          instrument: string
          market_value_krw: number | null
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          return_pct: number | null
          source: string | null
        }
        Insert: {
          account?: string | null
          batch_id?: string | null
          cost_krw?: number | null
          created_at?: string
          gain_loss_krw?: number | null
          id?: string
          instrument: string
          market_value_krw?: number | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          return_pct?: number | null
          source?: string | null
        }
        Update: {
          account?: string | null
          batch_id?: string | null
          cost_krw?: number | null
          created_at?: string
          gain_loss_krw?: number | null
          id?: string
          instrument?: string
          market_value_krw?: number | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          return_pct?: number | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_holdings_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      networth_snapshot: {
        Row: {
          batch_id: string | null
          created_at: string
          date_or_scenario: string
          id: string
          metric: string
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          source: string | null
          value_krw: number | null
          value_text: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          date_or_scenario: string
          id?: string
          metric: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          value_krw?: number | null
          value_text?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          date_or_scenario?: string
          id?: string
          metric?: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          value_krw?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "networth_snapshot_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      pension_cashflow: {
        Row: {
          age: number | null
          annual_amount_thousand_krw: number
          batch_id: string | null
          category: string | null
          created_at: string
          id: string
          institution: string | null
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          product: string
          source: string | null
          year: number
        }
        Insert: {
          age?: number | null
          annual_amount_thousand_krw?: number
          batch_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          product: string
          source?: string | null
          year: number
        }
        Update: {
          age?: number | null
          annual_amount_thousand_krw?: number
          batch_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          product?: string
          source?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "pension_cashflow_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          life_os_scope: Database["public"]["Enums"]["life_os_scope"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          life_os_scope: Database["public"]["Enums"]["life_os_scope"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          life_os_scope?: Database["public"]["Enums"]["life_os_scope"]
          updated_at?: string
        }
        Relationships: []
      }
      raw_import_batches: {
        Row: {
          error_count: number
          id: string
          imported_at: string
          imported_by: string | null
          metadata: Json
          row_count: number
          source_file_name: string | null
          source_hash: string | null
          source_kind: string
          source_name: string
          status: Database["public"]["Enums"]["import_status"]
        }
        Insert: {
          error_count?: number
          id?: string
          imported_at?: string
          imported_by?: string | null
          metadata?: Json
          row_count?: number
          source_file_name?: string | null
          source_hash?: string | null
          source_kind: string
          source_name: string
          status?: Database["public"]["Enums"]["import_status"]
        }
        Update: {
          error_count?: number
          id?: string
          imported_at?: string
          imported_by?: string | null
          metadata?: Json
          row_count?: number
          source_file_name?: string | null
          source_hash?: string | null
          source_kind?: string
          source_name?: string
          status?: Database["public"]["Enums"]["import_status"]
        }
        Relationships: [
          {
            foreignKeyName: "raw_import_batches_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_import_rows: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          row_data: Json
          row_hash: string
          row_number: number
          validation_errors: Json
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          row_data: Json
          row_hash: string
          row_number: number
          validation_errors?: Json
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          row_data?: Json
          row_hash?: string
          row_number?: number
          validation_errors?: Json
        }
        Relationships: [
          {
            foreignKeyName: "raw_import_rows_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      spending_ledger: {
        Row: {
          amount_krw: number
          approval_no: string | null
          batch_id: string | null
          card_company: string | null
          category: string
          created_at: string
          id: string
          memo: string | null
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          source: string | null
          transaction_at: string
          transaction_hash: string
          updated_at: string
        }
        Insert: {
          amount_krw: number
          approval_no?: string | null
          batch_id?: string | null
          card_company?: string | null
          category: string
          created_at?: string
          id?: string
          memo?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          transaction_at: string
          transaction_hash: string
          updated_at?: string
        }
        Update: {
          amount_krw?: number
          approval_no?: string | null
          batch_id?: string | null
          card_company?: string | null
          category?: string
          created_at?: string
          id?: string
          memo?: string | null
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          transaction_at?: string
          transaction_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spending_ledger_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_history: {
        Row: {
          amount_krw: number
          batch_id: string | null
          created_at: string
          id: string
          owner_scope: Database["public"]["Enums"]["life_os_scope"]
          source: string | null
          tax_type: string
          tax_year: number
        }
        Insert: {
          amount_krw?: number
          batch_id?: string | null
          created_at?: string
          id?: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          tax_type: string
          tax_year: number
        }
        Update: {
          amount_krw?: number
          batch_id?: string | null
          created_at?: string
          id?: string
          owner_scope?: Database["public"]["Enums"]["life_os_scope"]
          source?: string | null
          tax_type?: string
          tax_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_history_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "raw_import_batches"
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
      alert_severity: "low" | "moderate" | "high" | "critical"
      import_status: "pending" | "validated" | "imported" | "failed"
      life_os_scope: "USER_JH" | "USER_YR" | "FAMILY_COMBINED"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "moderate", "high", "critical"],
      import_status: ["pending", "validated", "imported", "failed"],
      life_os_scope: ["USER_JH", "USER_YR", "FAMILY_COMBINED"],
    },
  },
} as const
