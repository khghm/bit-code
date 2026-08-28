import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, fa, faGroup, useCountUp, useInView, usePrefersReducedMotion, useScramble } from '../lib/hooks';
import { IconArrow, IconCap, IconCert, IconClock, IconSpark, IconTerminal } from './Icons';
import { Stars } from './Shared';

type Tok = { cls: string; t: string };

const CODE: Tok[][] = [
  [{ cls: 'tk-cm', t: '# bitcode.academy — masir-e mohandesi' }],
  [{ cls: 'tk-kw', t: 'class ' }, { cls: 'tk-cls', t: 'Engineer' }, { cls: 'tk-op', t: ':' }],
  [{ cls: 'tk-pl', t: '    skills ' }, { cls: 'tk-op', t: '= [' }, { cls: 'tk-st', t: '"python", "algorithms", "UML"' }, { cls: 'tk-op', t: ']' }],
  [],
  [{ cls: 'tk-kw', t: '    def ' }, { cls: 'tk-fn', t: '__init__' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-pl', t: 'self, name' }, { cls: 'tk-op', t: '):' }],
  [{ cls: 'tk-pl', t: '        self.name ' }, { cls: 'tk-op', t: '= ' }, { cls: 'tk-pl', t: 'name' }],
  [{ cls: 'tk-pl', t: '        self.level ' }, { cls: 'tk-op', t: '= ' }, { cls: 'tk-st', t: '"junior"' }],
  [],
  [{ cls: 'tk-kw', t: '    def ' }, { cls: 'tk-fn', t: 'learn' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-pl', t: 'self, course' }, { cls: 'tk-op', t: '):' }],
  [{ cls: 'tk-pl', t: '        self.skills.' }, { cls: 'tk-fn', t: 'append' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-pl', t: 'course' }, { cls: 'tk-op', t: ')' }],
  [{ cls: 'tk-kw', t: '        return ' }, { cls: 'tk-st', t: 'f"{self.name} +1 skill"' }],
  [],
  [{ cls: 'tk-pl', t: 'you ' }, { cls: 'tk-op', t: '= ' }, { cls: 'tk-cls', t: 'Engineer' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-st', t: '"shoma"' }, { cls: 'tk-op', t: ')' }],
  [{ cls: 'tk-kw', t: 'while ' }, { cls: 'tk-pl', t: 'you.level ' }, { cls: 'tk-op', t: '!= ' }, { cls: 'tk-st', t: '"senior"' }, { cls: 'tk-op', t: ':' }],
  [{ cls: 'tk-pl', t: '    you.' }, { cls: 'tk-fn', t: 'learn' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-fn', t: 'next_course' }, { cls: 'tk-op', t: '())' }],
  [{ cls: 'tk-fn', t: 'print' }, { cls: 'tk-op', t: '(' }, { cls: 'tk-pl', t: 'you' }, { cls: 'tk-op', t: ')  ' }, { cls: 'tk-cm', t: '# => mohandes-e narm-afzar ✓' }],
];

const ROADMAP_MD = [
  { cls: 'tk-fn', t: '# roadmap — mohandesi-e narm-afzar' },
  { cls: 'tk-pl', t: '' },
  { cls: 'tk-st', t: '- [x] mabani-e barnamehnevisi ba Python' },
  { cls: 'tk-st', t: '- [x] sakhteman-e dade va algorithm-ha' },
  { cls: 'tk-st', t: '- [x] mohandesi-e narm-afzar va UML' },
  { cls: 'tk-pl', t: '- [ ] memari va microservice-ha  < shoma inja hastid' },
  { cls: 'tk-pl', t: '- [ ] DevOps va esteghrar' },
  { cls: 'tk-pl', t: '' },
  { cls: 'tk-cm', t: '> 8 faz · 74 hafte · 17 dore' },
];

const TOTAL = CODE.flat().reduce((s, t) => s + t.t.length, 0);

const liveSessions = [
  { title: 'کدریوی زنده پروژه میکروسرویس دانشجویان', mentor: 'دکتر آرش کمالی', day: 'شنبه', time: '۲۰:۰۰', live: true },
  { title: 'پرسش و پاسخ: نقشه راه ورود به بازار کار', mentor: 'مهندس نگار رستمی', day: 'دوشنبه', time: '۲۱:۰۰', live: false },
  { title: 'کارگاه عملی الگوریتم: گراف در مصاحبه', mentor: 'دکتر بردیا افشار', day: 'چهارشنبه', time: '۱۹:۳۰', live: false },
];

const stats = [
  { value: 17, suffix: '', label: 'دوره تخصصی', sub: 'در ۶ حوزه مهندسی' },
  { value: 840, suffix: '+', label: 'ساعت آموزش ویدیویی', sub: 'با پروژه و تمرین' },
  { value: 12400, suffix: '+', label: 'دانشجوی فعال', sub: 'در سراسر کشور' },
  { value: 96, suffix: '٪', label: 'نرخ رضایت', sub: 'بر اساس نظرسنجی ترم قبل' },
];

const techMarquee = ['پایتون', 'جاوا', 'TypeScript', 'React', 'Node.js', 'Git', 'Docker', 'Kubernetes', 'PostgreSQL', 'Linux', 'UML', 'Clean Architecture', 'CI/CD', 'GraphQL', 'Rust'];

function Editor() {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<'py' | 'md'>('py');
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduced || tab !== 'py') return;
    let interval = 0;
    let timeout = 0;
    interval = window.setInterval(() => {
      setChars((c) => {
        if (c >= TOTAL) {
          window.clearInterval(interval);
          timeout = window.setTimeout(() => setChars(0), 4200);
          return c;
        }
        return c + 2;
      });
    }, 34);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [reduced, tab]);

  const rendered = useMemo(() => {
    const shown = reduced && tab === 'py' ? TOTAL : tab === 'py' ? chars : TOTAL;
    let rem = shown;
    let lastActive = 0;
    const lines = CODE.map((line, li) => {
      const out: Tok[] = [];
      line.forEach((tok) => {
        if (rem <= 0) return;
        const take = Math.min(tok.t.length, rem);
        if (take > 0) {
          out.push({ cls: tok.cls, t: tok.t.slice(0, take) });
          lastActive = li;
        }
        rem -= take;
      });
      return out;
    });
    return { lines, lastActive };
  }, [chars, tab, reduced]);

  const caretLine = tab === 'py' ? rendered.lastActive : -1;

  return (
    <div className="relative rounded-lg border border-linec bg-night-900/90 shadow-[0_30px_80px_rgba(2,8,16,0.6)] overflow-hidden corners always" dir="ltr">
      <div className="flex items-center gap-2 px-4 h-11 border-b border-linec bg-night-800/80">
        <span className="w-3 h-3 rounded-full bg-coral/80" />
        <span className="w-3 h-3 rounded-full bg-amber/80" />
        <span className="w-3 h-3 rounded-full bg-teal/80" />
        <div className="flex items-center gap-1 mr-3 text-[11px] font-code">
          <button
            onClick={() => setTab('py')}
            className={`px-3 py-1 rounded-t transition-colors ${tab === 'py' ? 'bg-night-900 text-amber border border-b-0 border-linec' : 'text-faint hover:text-dim'}`}
          >
            main.py
          </button>
          <button
            onClick={() => setTab('md')}
            className={`px-3 py-1 rounded-t transition-colors ${tab === 'md' ? 'bg-night-900 text-teal border border-b-0 border-linec' : 'text-faint hover:text-dim'}`}
          >
            roadmap.md
          </button>
        </div>
        <span className="ml-auto text-faint text-[10px] font-code tracking-widest hidden sm:block">bitcode@academy:~</span>
      </div>

      <div className="py-4 font-code text-[12.5px] leading-[1.9] min-h-[340px]">
        {tab === 'py' ? (
          rendered.lines.map((line, li) => (
            <div key={li} className="flex px-2 hover:bg-night-800/50">
              <span className="w-9 shrink-0 text-right pr-3 text-faint/60 select-none">{li + 1}</span>
              <span className="flex-1 whitespace-pre">
                {line.map((tok, ti) => (
                  <span key={ti} className={tok.cls}>{tok.t}</span>
                ))}
                {caretLine === li && <span className="caret inline-block w-[7px] h-[15px] bg-amber align-middle ml-0.5" />}
              </span>
            </div>
          ))
        ) : (
          ROADMAP_MD.map((l, i) => (
            <div key={i} className="px-6 whitespace-pre">
              <span className={l.cls}>{l.t}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between px-4 h-8 border-t border-linec bg-night-800/80 text-[10px] font-code text-faint">
        <span className="flex items-center gap-3">
          <span className="text-teal">● {tab === 'py' ? 'Python 3.12' : 'Markdown'}</span>
          <span>UTF-8</span>
        </span>
        <span>Ln {tab === 'py' ? fa(caretLine + 1) : fa(9)}, Col {fa(tab === 'py' ? Math.max(1, chars % 40) : 1)}</span>
      </div>
    </div>
  );
}

function StatBox({ value, suffix, label, sub, delay }: { value: number; suffix: string; label: string; sub: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const n = useCountUp(value, inView, 1400 + delay);
  return (
    <div ref={ref} className={`reveal ${inView ? 'is-in' : ''} group border border-linec bg-night-900/60 rounded-md p-5 transition-all duration-300 hover:border-amber/40 hover:-translate-y-1`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      <div className="font-display text-4xl sm:text-[42px] text-mist leading-none">
        {faGroup(n)}
        <span className="text-amber">{suffix}</span>
      </div>
      <div className="text-sm text-dim mt-2 font-medium">{label}</div>
      <div className="text-[11px] text-faint mt-0.5">{sub}</div>
    </div>
  );
}

interface HeroProps {
  onAuthRequired?: () => void;
}

export default function Hero({ onAuthRequired }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  const kicker = useScramble('// software-engineering.academy', mounted, 22);

  return (
    <section id="top" className="relative overflow-hidden">
      <svg viewBox="0 0 400 400" className="absolute -left-32 top-24 w-[480px] h-[480px] text-linec spin-slow pointer-events-none" aria-hidden="true">
        <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 14" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="186" y="26" width="28" height="28" fill="none" stroke="var(--color-amber)" strokeWidth="1.2" transform="rotate(45 200 40)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 pt-40 lg:pt-44 pb-14">
        <div className={`grid lg:grid-cols-12 gap-12 lg:gap-8 items-center ${mounted ? 'masks-in' : ''}`}>
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className="font-code text-teal text-[13px] tracking-[0.18em] min-h-[20px]" dir="ltr">
              {kicker}
            </p>

            <h1 className="font-display text-[44px] sm:text-6xl lg:text-[64px] leading-[1.28] mt-6 text-mist">
              <span className="block overflow-hidden pb-1">
                <span className="mask-line">اینجا کدنویسی را</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="mask-line" style={{ '--d': '150ms' } as React.CSSProperties}>
                  <span className="text-amber relative">
                    مهندسی
                    <svg viewBox="0 0 140 12" className="absolute -bottom-1 right-0 w-full h-3 text-teal/70" aria-hidden="true">
                      <path d="M3 9C30 3 70 3 137 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span> می‌کنند.</span>
                </span>
              </span>
            </h1>

            <p className="text-dim leading-9 mt-7 max-w-xl text-[15px]">
              از اولین <b className="text-mist">print("hello")</b> تا بازاریابی دیجیتال و رشد محصول؛ ۲۲ دوره تخصصی،
              مسیر یادگیری ترم‌بندی‌شده، پروژه‌های واقعی با Code Review انسانی و منتورینگ هفتگی —
              همه‌چیز برای تبدیل‌شدن به یک مهندس نرم‌افزار کامل.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-9">
              <Link to="/courses" className="group inline-flex items-center gap-3 bg-amber text-night-900 font-bold rounded-md px-7 py-3.5 transition-all duration-300 hover:bg-[#ffc775] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,180,84,0.28)]">
                شروع یادگیری
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              <a href="#roadmap" className="inline-flex items-center gap-2 border border-linec text-dim font-medium rounded-md px-6 py-3.5 transition-all duration-300 hover:border-teal/60 hover:text-teal">
                <IconCap className="w-5 h-5" />
                مشاهده مسیر یادگیری
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 text-sm text-dim">
              <span className="flex items-center gap-2">
                <Stars value={5} />
                <b className="text-mist">{fa('4.9')}</b> از ۵
              </span>
              <span className="w-px h-4 bg-linec hidden sm:block" />
              <span><b className="text-mist">{faGroup(12400)}</b> دانشجوی فعال</span>
              <span className="w-px h-4 bg-linec hidden sm:block" />
              <span className="flex items-center gap-1.5"><IconCert className="w-4 h-4 text-teal" /> گواهی قابل استعلام</span>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <Reveal delay={200}>
              <div className="relative">
                <Editor />

                <div className="absolute -top-5 left-6 hidden md:flex items-center gap-2 bg-night-700 border border-amber/30 rounded-full px-4 py-2 text-xs font-semibold text-amber floaty shadow-lg">
                  <IconSpark className="w-4 h-4" />
                  ۱۰۰٪ پروژه‌محور
                </div>

                <div className="absolute -bottom-7 right-4 sm:right-8 hidden md:flex items-center gap-3 bg-night-800 border border-linec rounded-lg px-4 py-3 shadow-[0_16px_40px_rgba(2,8,16,0.5)] floaty-slow">
                  <span className="w-10 h-10 grid place-items-center rounded-md bg-teal/10 border border-teal/30 text-teal">
                    <IconCert className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-mist">گواهی رسمی پایان دوره</span>
                    <span className="block text-[11px] text-faint mt-0.5">با کد یکتای قابل استعلام</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-14">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <IconTerminal className="w-5 h-5 text-amber" />
            <h3 className="font-display text-2xl text-mist">کلاس‌های لایو این هفته</h3>
            <span className="h-px flex-1 bg-linec" />
            <Link to="/courses" className="text-xs text-faint hover:text-amber transition-colors hidden sm:block">برنامه کامل ←</Link>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {liveSessions.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div className="group border border-linec bg-night-900/60 rounded-md p-4 h-full transition-all duration-300 hover:border-cyan/40 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-code text-[11px] text-cyan border border-cyan/30 bg-cyan/5 rounded px-2 py-1">{s.day}</span>
                  {s.live ? (
                    <span className="flex items-center gap-2 text-[11px] font-bold text-teal">
                      <span className="w-2 h-2 rounded-full bg-teal live-dot" />
                      همین حالا زنده
                    </span>
                  ) : (
                    <span className="text-[11px] text-faint">به‌زودی</span>
                  )}
                </div>
                <h4 className="font-bold text-mist mt-3 leading-7 text-[15px] group-hover:text-cyan transition-colors">{s.title}</h4>
                <div className="flex items-center gap-3 mt-3 text-xs text-dim">
                  <span>{s.mentor}</span>
                  <span className="flex items-center gap-1 text-faint"><IconClock className="w-3.5 h-3.5" /> {fa(s.time)}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatBox key={s.label} value={s.value} suffix={s.suffix} label={s.label} sub={s.sub} delay={i * 100} />
          ))}
        </div>
      </div>

      <div className="marquee border-y border-linec bg-night-900/50 overflow-hidden py-4" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {techMarquee.map((t) => (
                <span key={`${copy}-${t}`} className="flex items-center gap-6 px-6">
                  <span className={`whitespace-nowrap ${/^[A-Za-z]/.test(t) ? 'font-code' : 'font-display text-lg'} text-dim`}>{t}</span>
                  <svg viewBox="0 0 8 8" className="w-2 h-2 text-amber/60"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
