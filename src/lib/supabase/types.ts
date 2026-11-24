// Complete TypeScript Database Schema matching supabase/migrations/001_initial_schema.sql
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          city: string;
          bio: string;
          role: "admin" | "member" | "partner" | "school";
          status: "active" | "suspended";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          city?: string;
          bio?: string;
          role?: "admin" | "member" | "partner" | "school";
          status?: "active" | "suspended";
          created_at?: string;
        };
        Update: {
          name?: string;
          city?: string;
          bio?: string;
          role?: "admin" | "member" | "partner" | "school";
          status?: "active" | "suspended";
        };
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          kind: string;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          kind: string;
          data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          kind?: string;
          data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: number;
          sender: string;
          email: string;
          subject: string;
          message: string;
          date: string;
          is_read: boolean;
        };
        Insert: {
          id?: number;
          sender: string;
          email: string;
          subject: string;
          message: string;
          date?: string;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          id: number;
          kind: string;
          email: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          kind: string;
          email?: string;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          kind?: string;
          email?: string;
          payload?: Json;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: number;
          event_id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string;
          ticket_code: string;
          status: "Confirmed" | "Attended" | "Cancelled";
          created_at: string;
        };
        Insert: {
          id?: number;
          event_id: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone: string;
          ticket_code: string;
          status?: "Confirmed" | "Attended" | "Cancelled";
          created_at?: string;
        };
        Update: {
          status?: "Confirmed" | "Attended" | "Cancelled";
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          user_id: string;
          eco_points: number;
          virtual_trees: number;
          earned_badges: number;
        };
        Insert: {
          user_id: string;
          eco_points?: number;
          virtual_trees?: number;
          earned_badges?: number;
        };
        Update: {
          eco_points?: number;
          virtual_trees?: number;
          earned_badges?: number;
        };
        Relationships: [];
      };
      user_activities: {
        Row: {
          id: string;
          user_id: string;
          title_ar: string;
          title_en: string;
          detail_ar: string;
          detail_en: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title_ar: string;
          title_en: string;
          detail_ar: string;
          detail_en: string;
          created_at?: string;
        };
        Update: {
          title_ar?: string;
          title_en?: string;
          detail_ar?: string;
          detail_en?: string;
        };
        Relationships: [];
      };
      course_progress: {
        Row: {
          user_id: string;
          course_id: string;
          progress: number;
        };
        Insert: {
          user_id: string;
          course_id: string;
          progress?: number;
        };
        Update: {
          progress?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: number;
          course_id: string;
          title_en: string;
          title_ar: string;
          description_en: string;
          description_ar: string;
          lesson_order: number;
          duration: string;
          content_url: string;
          content_en: string;
          content_ar: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          course_id: string;
          title_en: string;
          title_ar: string;
          description_en?: string;
          description_ar?: string;
          lesson_order: number;
          duration?: string;
          content_url?: string;
          content_en?: string;
          content_ar?: string;
          is_published?: boolean;
        };
        Update: {
          title_en?: string;
          title_ar?: string;
          description_en?: string;
          description_ar?: string;
          lesson_order?: number;
          duration?: string;
          content_url?: string;
          content_en?: string;
          content_ar?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };
      impact_history: {
        Row: {
          id: number;
          user_id: string;
          action_type: string;
          value: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          action_type: string;
          value?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          value?: number;
          metadata?: Json;
        };
        Relationships: [];
      };
      carbon_footprints: {
        Row: {
          id: number;
          user_id: string;
          footprint: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          footprint: number;
          created_at?: string;
        };
        Update: {
          footprint?: number;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: number;
          user_id: string;
          content_type: string;
          content_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          content_type: string;
          content_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      admin_settings: {
        Row: {
          id: number;
          site_name: string;
          contact_email: string;
          enable_maintenance: boolean;
        };
        Insert: {
          id?: number;
          site_name?: string;
          contact_email?: string;
          enable_maintenance?: boolean;
        };
        Update: {
          site_name?: string;
          contact_email?: string;
          enable_maintenance?: boolean;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          resource: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action: string;
          resource: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: number;
          event_type: string;
          path: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          event_type: string;
          path?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      certificates: {
        Row: {
          id: number;
          user_id: string;
          course_id: string;
          certificate_id: string;
          issued_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          course_id: string;
          certificate_id: string;
          issued_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      uploads: {
        Row: {
          id: number;
          filename: string;
          url: string;
          content_type: string;
          size: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          filename: string;
          url: string;
          content_type: string;
          size: number;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      can_update_own_profile: {
        Args: {
          target_id: string;
          new_role: string;
          new_status: string;
        };
        Returns: boolean;
      };
      increment_user_stats: {
        Args: {
          p_eco_points?: number;
          p_virtual_trees?: number;
          p_earned_badges?: number;
        };
        Returns: {
          eco_points: number;
          virtual_trees: number;
          earned_badges: number;
        }[];
      };
      redeem_virtual_tree: {
        Args: {
          p_cost?: number;
        };
        Returns: {
          eco_points: number;
          virtual_trees: number;
          earned_badges: number;
        }[];
      };
      record_carbon_footprint: {
        Args: {
          p_footprint: number;
        };
        Returns: {
          awarded_points: number;
          eco_points: number;
        }[];
      };
      issue_course_certificate: {
        Args: {
          p_course_id: string;
          p_certificate_id: string;
        };
        Returns: {
          id: number;
          user_id: string;
          course_id: string;
          certificate_id: string;
          issued_at: string;
        }[];
      };
      verify_certificate: {
        Args: {
          p_certificate_id: string;
        };
        Returns: {
          certificate_id: string;
          course_id: string;
          issued_at: string;
          holder_name: string;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
}

