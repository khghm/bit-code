import { useState, useEffect, useCallback } from 'react';
import {
  categoriesApi,
  coursesApi,
  phasesApi,
  mentorsApi,
  testimonialsApi,
  faqsApi,
  lessonsApi,
  progressApi,
  enrollmentsApi,
} from '../services/api';
import type { Database } from '../types/database';

type Course = Database['public']['Tables']['courses']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];
type Mentor = Database['public']['Tables']['mentors']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type Faq = Database['public']['Tables']['faqs']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    coursesApi
      .getAll()
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}

export function useCourse(courseId: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    coursesApi
      .getById(courseId)
      .then(setCourse)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { course, loading, error };
}

export function usePhases() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    phasesApi
      .getAll()
      .then(setPhases)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { phases, loading, error };
}

export function useMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    mentorsApi
      .getAll()
      .then(setMentors)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { mentors, loading, error };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    testimonialsApi
      .getAll()
      .then(setTestimonials)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading, error };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    faqsApi
      .getAll()
      .then(setFaqs)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading, error };
}

export function useLessons(courseId: string | undefined) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    lessonsApi
      .getByCourseId(courseId)
      .then(setLessons)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { lessons, loading, error };
}

export function useProgress(userId: string | undefined, courseId: string | undefined) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false);
      return;
    }
    progressApi
      .getProgress(userId, courseId)
      .then((progress) => setCompletedLessons(progress?.completed_lessons ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId, courseId]);

  const toggleLesson = useCallback(
    async (lessonId: string) => {
      if (!userId || !courseId) return;
      try {
        const result = await progressApi.toggleLesson(userId, courseId, lessonId);
        setCompletedLessons(result.completedLessons);
        return result.isCompleted;
      } catch (err) {
        setError(err as Error);
      }
    },
    [userId, courseId]
  );

  return { completedLessons, loading, error, toggleLesson };
}

export function useEnrollments(userId: string | undefined) {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    enrollmentsApi
      .getUserEnrollments(userId)
      .then((enrollments) => setEnrolledCourseIds(new Set(enrollments.map((e) => e.course_id))))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleEnroll = useCallback(
    async (courseId: string) => {
      if (!userId) return;
      try {
        if (enrolledCourseIds.has(courseId)) {
          await enrollmentsApi.unenroll(userId, courseId);
          setEnrolledCourseIds((prev) => {
            const next = new Set(prev);
            next.delete(courseId);
            return next;
          });
        } else {
          await enrollmentsApi.enroll(userId, courseId);
          setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [userId, enrolledCourseIds]
  );

  return { enrolledCourseIds, loading, error, toggleEnroll };
}
