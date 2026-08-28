import { describe, it, expect, vi } from 'vitest';

const mockUpsert = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockDelete = vi.fn().mockReturnThis();

vi.mock('../lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
      upsert: mockUpsert,
      insert: mockInsert,
      delete: mockDelete,
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

describe('API Services', () => {
  describe('categoriesApi', () => {
    it('getAll returns categories', async () => {
      const { categoriesApi } = await import('../services/api');
      mockOrder.mockResolvedValueOnce({ data: [{ id: 'prog', label: 'برنامه‌نویسی' }], error: null });
      const result = await categoriesApi.getAll();
      expect(result).toEqual([{ id: 'prog', label: 'برنامه‌نویسی' }]);
    });
  });

  describe('coursesApi', () => {
    it('getAll returns courses', async () => {
      const { coursesApi } = await import('../services/api');
      mockOrder.mockResolvedValueOnce({ data: [{ id: 'py', title: 'پایتون' }], error: null });
      const result = await coursesApi.getAll();
      expect(result).toEqual([{ id: 'py', title: 'پایتون' }]);
    });
  });

  describe('progressApi', () => {
    it('getProgress returns null when no progress', async () => {
      const { progressApi } = await import('../services/api');
      mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      const result = await progressApi.getProgress('user-1', 'course-1');
      expect(result).toBeNull();
    });
  });
});
