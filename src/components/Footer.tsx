import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, fa } from '../lib/hooks';
import { IconArrow, LogoMark } from './Icons';
import { useAuth } from '../context/AuthContext';

const SOCIALS = [
  { name: 'تلگرام', path: 'M21.5 4.6 3 11.3l4.8 1.8 1.7 5.3 2.7-3 4.9 3.6 4.4-14.4Zm-8.2 9.6-1 3.1-1-3.2 6.6-6-4.6 6.1Z' },
  { name: 'اینستاگرام', path: 'M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm4 5.2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm4.9-1.4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z' },
  { name: 'یوتیوب', path: 'M21 8.2c0-1.7-1.4-3-3-3.2-2.4-.3-4.9-.4-6-.4s-3.6.1-6 .4c-1.6.2-3 1.5-3 3.2-.2 1.3-.3 2.6-.3 3.8s.1 2.5.3 3.8c0 1.7 1.4 3 3 3.2 2.4.3 4.9.4 6 .4s3.6-.1 6-.4c1.6-.2 3-1.5 3-3.2.2-1.3.3-2.6.3-3.8s-.1-2.5-.3-3.8ZM10 15.4V8.6l6 3.4-6 3.4Z' },
  { name: 'لینکدین', path: 'M6.5 8.8H3.8V20h2.7V8.8ZM5.1 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20.2 13.6c0-3-1.6-4.9-4.2-4.9-1.4 0-2.5.7-3 1.8V8.8h-2.7V20h2.7v-5.7c0-1.6.8-2.5 2-2.5 1.1 0 1.9.7 1.9 2.5V20h2.7l.6-6.4Z' },
];

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'err'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email.trim())) {
      setState('ok');
      setEmail('');
    } else {
      setState('err');
    }
  };

  return (
    <>
      <section className="border-t border-linec relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_50%_120%,rgba(255,180,84,0.12),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center relative">
          <Reveal>
            <p className="font-code text-teal text-xs tracking-[0.35em]" dir="ltr">READY? git commit -m "start"</p>
            <h2 className="font-display text-4xl sm:text-6xl leading-[1.3] mt-6 text-mist">
              آماده‌ای اولین خطِ <span className="text-amber">مسیرت</span> را بنویسی؟
            </h2>
            <p className="text-dim max-w-xl mx-auto mt-5 leading-8 text-[15px]">
              دوره پایتون و لینوکس کاملاً رایگان‌اند؛ بدون کارت بانکی، بدون تعهد. فقط شروع کن.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
              <Link to="/courses" className="group inline-flex items-center gap-3 bg-amber text-night-900 font-bold rounded-md px-8 py-4 transition-all duration-300 hover:bg-[#ffc775] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(255,180,84,0.3)]">
                شروع رایگان همین حالا
                <IconArrow className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link to="/#faq" className="text-sm font-semibold text-dim border border-linec rounded-md px-6 py-4 hover:border-teal/50 hover:text-teal transition-colors">
                صحبت با مشاور
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-linec bg-night-900/70">
        <div className="max-w-7xl mx-auto px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark className="w-10 h-10" />
              <span>
                <span className="block font-display text-[22px] text-mist leading-6">بیت‌کد</span>
                <span className="block font-code text-[9px] tracking-[0.4em] text-faint" dir="ltr">ACADEMY</span>
              </span>
            </Link>
            <p className="text-sm text-dim leading-8 mt-5 max-w-xs">
              آکادمی تخصصی مهندسی نرم‌افزار؛ جایی که کدنویسی به مهندسی تبدیل می‌شود. از ۱۳۹۸ تا امروز، کنار {fa('12,400')} دانشجو.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href="#top"
                  aria-label={s.name}
                  className="w-10 h-10 grid place-items-center border border-linec rounded-md text-faint transition-all duration-300 hover:text-amber hover:border-amber/50 hover:-translate-y-1"
                >
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-mist">دسترسی سریع</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-dim">
              <li><Link to="/courses" className="hover:text-amber transition-colors">دوره‌ها</Link></li>
              <li><Link to="/#roadmap" className="hover:text-amber transition-colors">مسیر یادگیری</Link></li>
              <li><Link to="/#syllabus" className="hover:text-amber transition-colors">سرفصل دوره جامع</Link></li>
              <li><Link to="/#mentors" className="hover:text-amber transition-colors">اساتید</Link></li>
              <li><Link to="/#faq" className="hover:text-amber transition-colors">سوالات متداول</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-mist">محبوب‌ترین دوره‌ها</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-dim">
              <li><Link to="/course/py" className="hover:text-teal transition-colors">مبانی برنامه‌نویسی با پایتون</Link></li>
              <li><Link to="/course/dsa" className="hover:text-teal transition-colors">ساختمان داده‌ها و الگوریتم‌ها</Link></li>
              <li><Link to="/course/react" className="hover:text-teal transition-colors">توسعه فرانت‌اند با React</Link></li>
              <li><Link to="/course/arch" className="hover:text-teal transition-colors">معماری نرم‌افزار و میکروسرویس‌ها</Link></li>
              <li><Link to="/course/linux" className="hover:text-teal transition-colors">لینوکس اوبونتو؛ از نصب تا مدیریت سرور</Link></li>
              <li><Link to="/course/vibe" className="hover:text-teal transition-colors">وایب کدینگ؛ برنامه‌نویسی با هوش مصنوعی</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-mist">خبرنامه مهندسی</h4>
            <p className="text-sm text-dim leading-7 mt-4">
              هفته‌ای یک ایمیل؛ خلاصه‌ی بهترین منابع مهندسی نرم‌افزار هفته + تخفیف‌های اختصاصی.
            </p>
            <form onSubmit={submit} className="mt-4 flex gap-2" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
                placeholder="ایمیل شما"
                dir="ltr"
                className="flex-1 min-w-0 bg-night-950 border border-linec rounded-md px-4 py-2.5 text-sm text-mist placeholder:text-faint text-left outline-none transition-colors focus:border-amber/60"
              />
              <button type="submit" className="bg-amber text-night-900 font-bold text-sm rounded-md px-5 py-2.5 hover:bg-[#ffc775] transition-colors shrink-0">
                عضویت
              </button>
            </form>
            {state === 'ok' && (
              <p className="text-teal text-xs mt-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                ثبت شد! اولین خبرنامه هفته بعد می‌رسد.
              </p>
            )}
            {state === 'err' && (
              <p className="text-coral text-xs mt-2.5">ایمیل معتبر نیست؛ دوباره بررسی کن.</p>
            )}
          </div>
        </div>

        <div className="border-t border-linec">
          <div className="max-w-7xl mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-faint">
            <p>© {fa(1405)} آکادمی بیت‌کد — تمامی حقوق محفوظ است.</p>
            <p className="font-code" dir="ltr">
              built with <span className="text-coral">♥</span> and a lot of <span className="text-amber">coffee</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
