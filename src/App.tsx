import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div dir="rtl" className="min-h-screen font-body text-mist antialiased relative">
            <div className="grid-layer" aria-hidden="true" />
            <div className="noise-layer" aria-hidden="true" />

            <Header />

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:courseId" element={<CoursePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>

            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
