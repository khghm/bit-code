import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEnrollments, useProgress, useCourses } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthModal from '../components/AuthModal';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 pt-48 pb-32 text-center">
        <p className="font-display text-4xl text-mist">برای مشاهده پروفایل وارد شوید</p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="mt-8 inline-flex items-center gap-2 bg-amber text-night-900 font-bold rounded-md px-7 py-3 hover:bg-[#ffc775] transition-colors"
        >
          ورود / ثبت‌نام
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </main>
    );
  }

  return <ProfileContent user={user} signOut={signOut} />;
}

function ProfileContent({ user, signOut }: { user: NonNullable<ReturnType<typeof useAuth>['user']>; signOut: () => Promise<void> }) {
  const { enrolledCourseIds } = useEnrollments(user.id);
  const { courses } = useCourses();

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.id));

  return (
    <main className="max-w-4xl mx-auto px-4 pt-32 pb-24">
      <div className="border border-linec bg-night-900/70 rounded-md p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber/20 border-2 border-amber/40 grid place-items-center font-display text-2xl text-amber">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-2xl text-mist">{user.user_metadata?.full_name || user.email}</h1>
              <p className="text-sm text-faint mt-1">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm border border-linec text-dim rounded-md px-5 py-2.5 hover:border-coral/50 hover:text-coral transition-colors"
          >
            خروج از حساب
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-linec">
          <h2 className="font-display text-xl text-mist mb-4">دوره‌های من</h2>
          {enrolledCourses.length === 0 ? (
            <p className="text-dim text-sm">هنوز در دوره‌ای ثبت‌نام نکرده‌ای.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border border-linec bg-night-800/60 rounded-md p-4">
                  <h3 className="font-bold text-mist">{course.title}</h3>
                  <p className="text-xs text-faint mt-1">{course.instructor}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
