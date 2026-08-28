import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoMark } from './Icons';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const NAV = [
  { to: '/courses', label: 'دوره‌ها' },
  { to: '/#roadmap', label: 'مسیر یادگیری' },
  { to: '/#syllabus', label: 'سرفصل جامع' },
  { to: '/#mentors', label: 'اساتید' },
  { to: '/#faq', label: 'سوالات' },
];

export default function Header() {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleNav = (to: string) => {
    setOpen(false);
    if (to.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const id = to.slice(2);
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = to.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(to);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="bg-night-800 border-b border-linec text-[12px]">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-3 text-dim">
          <span className="w-2 h-2 rounded-full bg-teal live-dot shrink-0" />
          <span>
            ثبت‌نام <b className="text-mist">ترم بهار ۱۴۰۵</b> فعال است — ۲۰٪ تخفیف همه مسیرها تا پایان فروردین
          </span>
          <span className="hidden sm:inline font-code text-teal border border-teal/30 bg-teal/5 rounded px-2 py-0.5 text-[10px] tracking-widest" dir="ltr">
            SPRING-1405
          </span>
        </div>
      </div>

      <div className="relative bg-night-950/90 backdrop-blur-sm border-b border-linec">
        <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group" aria-label="صفحه اصلی">
            <LogoMark className="w-10 h-10 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="leading-tight text-right">
              <span className="block font-display text-[22px] text-mist">بیت‌کد</span>
              <span className="block font-code text-[9px] tracking-[0.4em] text-faint" dir="ltr">ACADEMY</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((n) => (
              <button
                key={n.to}
                onClick={() => handleNav(n.to)}
                className="relative text-sm text-dim hover:text-mist transition-colors py-2 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-full after:bg-amber after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 bg-night-800 border border-linec text-mist font-medium text-sm rounded-md px-5 py-2.5 transition-all duration-300 hover:border-amber/50 hover:text-amber"
              >
                <span className="w-6 h-6 rounded-full bg-amber/20 border border-amber/40 grid place-items-center text-[10px] text-amber font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
                پروفایل
              </Link>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 bg-amber text-night-900 font-bold text-sm rounded-md px-5 py-2.5 transition-all duration-300 hover:bg-[#ffc775] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,180,84,0.25)] cursor-pointer"
              >
                ورود / ثبت‌نام
              </button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 grid place-items-center border border-linec rounded-md text-dim hover:text-mist hover:border-amber/50 transition-colors"
              aria-label="منوی موبایل"
              aria-expanded={open}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h10M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute bottom-[-1px] right-0 h-[2px] bg-gradient-to-l from-amber to-teal transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className={`lg:hidden overflow-hidden bg-night-900/98 border-b border-linec transition-[max-height] duration-500 ease-in-out ${open ? 'max-h-96' : 'max-h-0'}`}>
        <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col">
          {NAV.map((n) => (
            <button
              key={n.to}
              onClick={() => handleNav(n.to)}
              className="py-3 border-b border-linec/60 last:border-0 text-dim hover:text-amber transition-colors text-sm text-right cursor-pointer"
            >
              {n.label}
            </button>
          ))}
          {user && (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="py-3 text-dim hover:text-amber transition-colors text-sm text-right"
            >
              پروفایل
            </Link>
          )}
        </nav>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
