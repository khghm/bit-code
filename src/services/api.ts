import { supabase } from '../lib/supabase/client';
import type { Database } from '../types/database';

type Course = Database['public']['Tables']['courses']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];
type Mentor = Database['public']['Tables']['mentors']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type Faq = Database['public']['Tables']['faqs']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data;
  },
};

export const coursesApi = {
  async getAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getByCategory(catId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('cat', catId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getPopular(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('popular', true)
      .order('students', { ascending: false });
    if (error) throw error;
    return data;
  },

  async search(query: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .or(`title.ilike.%${query}%,instructor.ilike.%${query}%,skills.cs.{${query}}`)
      .order('created_at');
    if (error) throw error;
    return data;
  },
};

export const phasesApi = {
  async getAll(): Promise<Phase[]> {
    const { data, error } = await supabase
      .from('phases')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data;
  },
};

export const mentorsApi = {
  async getAll(): Promise<Mentor[]> {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('students', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at');
    if (error) throw error;
    return data;
  },
};

export const faqsApi = {
  async getAll(): Promise<Faq[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data;
  },
};

export const lessonsApi = {
  async getByCourseId(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};

export const progressApi = {
  async getProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async updateProgress(
    userId: string,
    courseId: string,
    completedLessons: string[],
    lastLessonId: string
  ): Promise<UserProgress> {
    const { data, error } = await (supabase as any)
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          course_id: courseId,
          completed_lessons: completedLessons,
          last_lesson_id: lastLessonId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,course_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<{ completedLessons: string[]; isCompleted: boolean }> {
    const progress = await this.getProgress(userId, courseId);
    const completed = progress?.completed_lessons ?? [];
    const isCompleted = completed.includes(lessonId);

    const newCompleted = isCompleted
      ? completed.filter((id) => id !== lessonId)
      : [...completed, lessonId];

    await this.updateProgress(userId, courseId, newCompleted, lessonId);
    return { completedLessons: newCompleted, isCompleted: !isCompleted };
  },
};

export const enrollmentsApi = {
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await (supabase as any)
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async unenroll(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);
    if (error) throw error;
  },

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
};
