import { useCourses, useCategories } from '../hooks/useData';
import Courses from '../components/Courses';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CoursesPage() {
  const { courses, loading: coursesLoading } = useCourses();
  const { categories, loading: categoriesLoading } = useCategories();

  if (coursesLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-24">
      <Courses courses={courses} categories={categories} />
    </main>
  );
}
