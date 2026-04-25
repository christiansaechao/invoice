export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      ai_generation_logs: {
        Row: {
          cost: number;
          created_at: string | null;
          id: string;
          prompt_hash: string | null;
          response: Json | null;
          status: string;
          user_id: string;
        };
        Insert: {
          cost?: number;
          created_at?: string | null;
          id?: string;
          prompt_hash?: string | null;
          response?: Json | null;
          status: string;
          user_id: string;
        };
        Update: {
          cost?: number;
          created_at?: string | null;
          id?: string;
          prompt_hash?: string | null;
          response?: Json | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_generation_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          address: string | null;
          city: string | null;
          company_name: string;
          contact_name: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          industry: string | null;
          is_archived: boolean | null;
          notes: Json | null;
          phone: string | null;
          state: string | null;
          updated_at: string | null;
          user_id: string;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          company_name: string;
          contact_name?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          industry?: string | null;
          is_archived?: boolean | null;
          notes?: Json | null;
          phone?: string | null;
          state?: string | null;
          updated_at?: string | null;
          user_id: string;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          company_name?: string;
          contact_name?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          industry?: string | null;
          is_archived?: boolean | null;
          notes?: Json | null;
          phone?: string | null;
          state?: string | null;
          updated_at?: string | null;
          user_id?: string;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entries: {
        Row: {
          amount: number;
          category: string | null;
          created_at: string;
          description: string;
          id: string;
          invoice_id: string;
          item_name: string | null;
          quantity: number;
          service_date: string;
          unit_price: number | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          category?: string | null;
          created_at?: string;
          description: string;
          id?: string;
          invoice_id: string;
          item_name?: string | null;
          quantity: number;
          service_date: string;
          unit_price?: number | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          category?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          invoice_id?: string;
          item_name?: string | null;
          quantity?: number;
          service_date?: string;
          unit_price?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entries_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_email_events: {
        Row: {
          created_at: string | null;
          id: string;
          invoice_id: string;
          metadata: Json | null;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          invoice_id: string;
          metadata?: Json | null;
          type: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          invoice_id?: string;
          metadata?: Json | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_email_events_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_payments: {
        Row: {
          amount: number | null;
          created_at: string | null;
          id: string;
          invoice_id: string;
          paid_at: string | null;
          payment_intent_id: string | null;
          payment_method: string | null;
          status: string | null;
          stripe_session_id: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          id?: string;
          invoice_id: string;
          paid_at?: string | null;
          payment_intent_id?: string | null;
          payment_method?: string | null;
          status?: string | null;
          stripe_session_id?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          id?: string;
          invoice_id?: string;
          paid_at?: string | null;
          payment_intent_id?: string | null;
          payment_method?: string | null;
          status?: string | null;
          stripe_session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_templates: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          preview_url: string | null;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          preview_url?: string | null;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          preview_url?: string | null;
          slug?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          auto_nudge: boolean | null;
          client_id: string | null;
          created_at: string;
          currency: string | null;
          discount_type: string | null;
          discount_value: number | null;
          doc_type: Database["public"]["Enums"]["document_type"] | null;
          due_date: string | null;
          email_status: string | null;
          id: string;
          invoice_date: string | null;
          invoice_number: number;
          last_email_at: string | null;
          notes: string | null;
          nudge_paused_until: string | null;
          nudge_profile: string | null;
          paid_at: string | null;
          parent_recurring_id: string | null;
          payment_link: string | null;
          payment_methods: Json | null;
          status: Database["public"]["Enums"]["invoice_status"];
          subtotal: number | null;
          tax_amount: number | null;
          tax_rate: number | null;
          template_id: string | null;
          terms: string | null;
          total_amount: number | null;
          updated_at: string;
          user_id: string;
          work_week_only: boolean | null;
        };
        Insert: {
          auto_nudge?: boolean | null;
          client_id?: string | null;
          created_at?: string;
          currency?: string | null;
          discount_type?: string | null;
          discount_value?: number | null;
          doc_type?: Database["public"]["Enums"]["document_type"] | null;
          due_date?: string | null;
          email_status?: string | null;
          id?: string;
          invoice_date?: string | null;
          invoice_number: number;
          last_email_at?: string | null;
          notes?: string | null;
          nudge_paused_until?: string | null;
          nudge_profile?: string | null;
          paid_at?: string | null;
          parent_recurring_id?: string | null;
          payment_link?: string | null;
          payment_methods?: Json | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          subtotal?: number | null;
          tax_amount?: number | null;
          tax_rate?: number | null;
          template_id?: string | null;
          terms?: string | null;
          total_amount?: number | null;
          updated_at?: string;
          user_id?: string;
          work_week_only?: boolean | null;
        };
        Update: {
          auto_nudge?: boolean | null;
          client_id?: string | null;
          created_at?: string;
          currency?: string | null;
          discount_type?: string | null;
          discount_value?: number | null;
          doc_type?: Database["public"]["Enums"]["document_type"] | null;
          due_date?: string | null;
          email_status?: string | null;
          id?: string;
          invoice_date?: string | null;
          invoice_number?: number;
          last_email_at?: string | null;
          notes?: string | null;
          nudge_paused_until?: string | null;
          nudge_profile?: string | null;
          paid_at?: string | null;
          parent_recurring_id?: string | null;
          payment_link?: string | null;
          payment_methods?: Json | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          subtotal?: number | null;
          tax_amount?: number | null;
          tax_rate?: number | null;
          template_id?: string | null;
          terms?: string | null;
          total_amount?: number | null;
          updated_at?: string;
          user_id?: string;
          work_week_only?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_parent_recurring_id_fkey";
            columns: ["parent_recurring_id"];
            isOneToOne: false;
            referencedRelation: "recurring_invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "invoice_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      nudge_history: {
        Row: {
          id: string;
          invoice_id: string | null;
          recipient_email: string;
          sent_at: string | null;
          type: Database["public"]["Enums"]["nudge_type"] | null;
        };
        Insert: {
          id?: string;
          invoice_id?: string | null;
          recipient_email: string;
          sent_at?: string | null;
          type?: Database["public"]["Enums"]["nudge_type"] | null;
        };
        Update: {
          id?: string;
          invoice_id?: string | null;
          recipient_email?: string;
          sent_at?: string | null;
          type?: Database["public"]["Enums"]["nudge_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "nudge_history_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          timezone: string | null;
          updated_at: string | null;
          work_week_only: boolean | null;
        };
        Insert: {
          id: string;
          timezone?: string | null;
          updated_at?: string | null;
          work_week_only?: boolean | null;
        };
        Update: {
          id?: string;
          timezone?: string | null;
          updated_at?: string | null;
          work_week_only?: boolean | null;
        };
        Relationships: [];
      };
      recurring_invoices: {
        Row: {
          client_id: string;
          created_at: string | null;
          currency: string | null;
          discount_type: string | null;
          discount_value: number | null;
          end_date: string | null;
          frequency: string;
          id: string;
          interval_data: number;
          max_occurrences: number | null;
          next_issue_date: string;
          notes: string | null;
          occurrences_count: number | null;
          payment_terms: string | null;
          status: string | null;
          tax_rate: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          client_id: string;
          created_at?: string | null;
          currency?: string | null;
          discount_type?: string | null;
          discount_value?: number | null;
          end_date?: string | null;
          frequency: string;
          id?: string;
          interval_data: number;
          max_occurrences?: number | null;
          next_issue_date: string;
          notes?: string | null;
          occurrences_count?: number | null;
          payment_terms?: string | null;
          status?: string | null;
          tax_rate?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          client_id?: string;
          created_at?: string | null;
          currency?: string | null;
          discount_type?: string | null;
          discount_value?: number | null;
          end_date?: string | null;
          frequency?: string;
          id?: string;
          interval_data?: number;
          max_occurrences?: number | null;
          next_issue_date?: string;
          notes?: string | null;
          occurrences_count?: number | null;
          payment_terms?: string | null;
          status?: string | null;
          tax_rate?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recurring_invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      user_settings: {
        Row: {
          created_at: string | null;
          default_client_id: string | null;
          default_template_id: string | null;
          payment_link: string | null;
          payment_methods: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          default_client_id?: string | null;
          default_template_id?: string | null;
          payment_link?: string | null;
          payment_methods?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          default_client_id?: string | null;
          default_template_id?: string | null;
          payment_link?: string | null;
          payment_methods?: Json | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_default_client_id_fkey";
            columns: ["default_client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_settings_default_template_id_fkey";
            columns: ["default_template_id"];
            isOneToOne: false;
            referencedRelation: "invoice_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_subscriptions: {
        Row: {
          billing_interval:
            | Database["public"]["Enums"]["subscription_interval"]
            | null;
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          credits_last_reset: string | null;
          current_period_end: string | null;
          id: string;
          magic_credits: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          tier: Database["public"]["Enums"]["subscription_tier"] | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          billing_interval?:
            | Database["public"]["Enums"]["subscription_interval"]
            | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          credits_last_reset?: string | null;
          current_period_end?: string | null;
          id?: string;
          magic_credits?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          tier?: Database["public"]["Enums"]["subscription_tier"] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          billing_interval?:
            | Database["public"]["Enums"]["subscription_interval"]
            | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          credits_last_reset?: string | null;
          current_period_end?: string | null;
          id?: string;
          magic_credits?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          tier?: Database["public"]["Enums"]["subscription_tier"] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          address: string | null;
          area_code: string | null;
          brand_logo_url: string | null;
          city: string | null;
          contact_email: string | null;
          created_at: string;
          default_hourly_rate: number | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          phone_number: string | null;
          preferred_email: string | null;
          state: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          area_code?: string | null;
          brand_logo_url?: string | null;
          city?: string | null;
          contact_email?: string | null;
          created_at?: string;
          default_hourly_rate?: number | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          phone_number?: string | null;
          preferred_email?: string | null;
          state?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          area_code?: string | null;
          brand_logo_url?: string | null;
          city?: string | null;
          contact_email?: string | null;
          created_at?: string;
          default_hourly_rate?: number | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone_number?: string | null;
          preferred_email?: string | null;
          state?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      webhook_events: {
        Row: {
          created_at: string | null;
          event_id: string;
        };
        Insert: {
          created_at?: string | null;
          event_id: string;
        };
        Update: {
          created_at?: string | null;
          event_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      clean_old_webhooks: { Args: never; Returns: undefined };
      create_invoice_with_atomic_number:
        | {
            Args: {
              p_auto_nudge?: boolean;
              p_client_id?: string;
              p_currency?: string;
              p_discount_type?: string;
              p_discount_value?: number;
              p_doc_type?: string;
              p_due_date?: string;
              p_invoice_date?: string;
              p_notes?: string;
              p_nudge_profile?: string;
              p_subtotal?: number;
              p_tax_amount?: number;
              p_tax_rate?: number;
              p_template_id?: string;
              p_terms?: string;
              p_total_amount?: number;
              p_user_id: string;
              p_work_week_only?: boolean;
            };
            Returns: {
              auto_nudge: boolean | null;
              client_id: string | null;
              created_at: string;
              currency: string | null;
              discount_type: string | null;
              discount_value: number | null;
              doc_type: Database["public"]["Enums"]["document_type"] | null;
              due_date: string | null;
              email_status: string | null;
              id: string;
              invoice_date: string | null;
              invoice_number: number;
              last_email_at: string | null;
              notes: string | null;
              nudge_paused_until: string | null;
              nudge_profile: string | null;
              paid_at: string | null;
              parent_recurring_id: string | null;
              payment_link: string | null;
              payment_methods: Json | null;
              status: Database["public"]["Enums"]["invoice_status"];
              subtotal: number | null;
              tax_amount: number | null;
              tax_rate: number | null;
              template_id: string | null;
              terms: string | null;
              total_amount: number | null;
              updated_at: string;
              user_id: string;
              work_week_only: boolean | null;
            };
            SetofOptions: {
              from: "*";
              to: "invoices";
              isOneToOne: true;
              isSetofReturn: false;
            };
          }
        | {
            Args: {
              p_auto_nudge?: boolean;
              p_client_id?: string;
              p_currency?: string;
              p_discount_type?: string;
              p_discount_value?: number;
              p_doc_type?: string;
              p_due_date?: string;
              p_entries?: Json;
              p_invoice_date?: string;
              p_notes?: string;
              p_nudge_profile?: string;
              p_subtotal?: number;
              p_tax_amount?: number;
              p_tax_rate?: number;
              p_template_id?: string;
              p_terms?: string;
              p_total_amount?: number;
              p_user_id: string;
              p_work_week_only?: boolean;
            };
            Returns: Json;
          };
      create_invoice_with_entries: {
        Args: {
          p_client_id: string;
          p_due_date: string;
          p_entries: Json;
          p_hourly_rate: number;
          p_invoice_date: string;
          p_user_id: string;
        };
        Returns: string;
      };
      decrement_user_magic_credits: {
        Args: { p_cost: number; p_user_id: string };
        Returns: number;
      };
      get_actionable_nudge_batch: {
        Args: { batch_size_val: number };
        Returns: string[];
      };
    };
    Enums: {
      document_type: "quote" | "invoice";
      invoice_status: "paid" | "pending" | "overdue";
      nudge_type: "initial" | "reminder_1" | "reminder_2" | "final_notice";
      subscription_interval: "month" | "year";
      subscription_status: "active" | "past_due" | "canceled" | "incomplete";
      subscription_tier: "starter" | "pro" | "teams";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      document_type: ["quote", "invoice"],
      invoice_status: ["paid", "pending", "overdue"],
      nudge_type: ["initial", "reminder_1", "reminder_2", "final_notice"],
      subscription_interval: ["month", "year"],
      subscription_status: ["active", "past_due", "canceled", "incomplete"],
      subscription_tier: ["starter", "pro", "teams"],
    },
  },
} as const;
