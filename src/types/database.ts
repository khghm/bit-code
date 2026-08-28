export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Hue = 'amber' | 'teal' | 'cyan' | 'coral';
export type CatId = 'prog' | 'cs' | 'se' | 'web' | 'data' | 'infra' | 'mkt';
export type Level = 'مقدماتی' | 'متوسط' | 'پیشرفته';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          label: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          label: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          cat: string;
          level: string;
          hours: number;
          sessions: number;
          students: number;
          rating: number;
          price: number;
          popular: boolean;
          instructor: string;
          skills: string[];
          hue: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          cat: string;
          level: string;
          hours: number;
          sessions: number;
          students?: number;
          rating?: number;
          price: number;
          popular?: boolean;
          instructor: string;
          skills: string[];
          hue: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          cat?: string;
          level?: string;
          hours?: number;
          sessions?: number;
          students?: number;
          rating?: number;
          price?: number;
          popular?: boolean;
          instructor?: string;
          skills?: string[];
          hue?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      phases: {
        Row: {
          id: number;
          term: string;
          title: string;
          weeks: number;
          description: string;
          tags: string[];
          hue: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: number;
          term: string;
          title: string;
          weeks: number;
          description: string;
          tags: string[];
          hue: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          term?: string;
          title?: string;
          weeks?: number;
          description?: string;
          tags?: string[];
          hue?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      mentors: {
        Row: {
          id: string;
          name: string;
          role: string;
          tags: string[];
          courses_count: number;
          students: number;
          rating: number;
          initials: string;
          hue: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: string;
          tags: string[];
          courses_count: number;
          students: number;
          rating: number;
          initials: string;
          hue: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          tags?: string[];
          courses_count?: number;
          students?: number;
          rating?: number;
          initials?: string;
          hue?: string;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          text: string;
          name: string;
          role: string;
          stars: number;
          created_at: string;
        };
        Insert: {
          id: string;
          text: string;
          name: string;
          role: string;
          stars: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          name?: string;
          role?: string;
          stars?: number;
          created_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          question: string;
          answer: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          minutes: number;
          sort_order: number;
          blocks: Json[];
          quiz: Json[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          title: string;
          minutes: number;
          sort_order: number;
          blocks: Json[];
          quiz: Json[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          minutes?: number;
          sort_order?: number;
          blocks?: Json[];
          quiz?: Json[];
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          completed_lessons: string[];
          last_lesson_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          completed_lessons?: string[];
          last_lesson_id?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          completed_lessons?: string[];
          last_lesson_id?: string | null;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrolled_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
