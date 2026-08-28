import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { useCourses, useCategories, useProgress, useEnrollments } from '../hooks/useData';

vi.mock('../lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      upsert: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('useCourses', () => {
  it('returns empty array initially', () => {
    const { result } = renderHook(() => useCourses());
    expect(result.current.courses).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('fetches courses', async () => {
    const { result } = renderHook(() => useCourses());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

describe('useCategories', () => {
  it('returns empty array initially', () => {
    const { result } = renderHook(() => useCategories());
    expect(result.current.categories).toEqual([]);
  });
});

describe('useProgress', () => {
  it('returns empty completed lessons for unauthenticated user', () => {
    const { result } = renderHook(() => useProgress(undefined, 'py'));
    expect(result.current.completedLessons).toEqual([]);
  });
});

describe('useEnrollments', () => {
  it('returns empty set for unauthenticated user', () => {
    const { result } = renderHook(() => useEnrollments(undefined));
    expect(result.current.enrolledCourseIds.size).toBe(0);
  });
});
