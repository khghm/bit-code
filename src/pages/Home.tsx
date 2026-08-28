import { useState } from 'react';
import { useCourses, usePhases, useMentors, useTestimonials, useFaqs, useCategories, useEnrollments } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Roadmap from '../components/Roadmap';
import Syllabus from '../components/Syllabus';
import Community from '../components/Community';
import Faq from '../components/Faq';
import AuthModal from '../components/AuthModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { courses, loading: coursesLoading } = useCourses();
  const { categories, loading: categoriesLoading } = useCategories();
  const { phases, loading: phasesLoading } = usePhases();
  const { mentors, loading: mentorsLoading } = useMentors();
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const { faqs, loading: faqsLoading } = useFaqs();
  const { enrolledCourseIds, toggleEnroll } = useEnrollments(user?.id);

  const loading = coursesLoading || categoriesLoading || phasesLoading || mentorsLoading || testimonialsLoading || faqsLoading;

  const handleAuthRequired = () => {
    setAuthModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Hero onAuthRequired={handleAuthRequired} />
      <Courses
        courses={courses}
        categories={categories}
        enrolledCourseIds={enrolledCourseIds}
        onToggleEnroll={toggleEnroll}
        onAuthRequired={handleAuthRequired}
      />
      <Roadmap phases={phases} />
      <Syllabus />
      <Community mentors={mentors} testimonials={testimonials} />
      <Faq faqs={faqs} />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
