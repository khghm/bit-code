import { useEffect, useRef, useState } from 'react';
import type { Database } from '../types/database';
import { Reveal, fa } from '../lib/hooks';
import { IconArrow, IconCheck, IconClock } from './Icons';
import { HUES, SectionHead } from './Shared';

type Phase = Database['public']['Tables']['phases']['Row'];
type Hue = 'amber' | 'teal' | 'cyan' | 'coral';

const NODE: Record<Hue, string> = {
  amber: 'border-amber/60 text-amber',
  teal: 'border-teal/60 text-teal',
  cyan: 'border-cyan/60 text-cyan',
  coral: 'border-coral/60 text-coral',
};

interface RoadmapProps {
  phases: Phase[];
}

export default function Roadmap({ phases }: RoadmapProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [phases]);

  return (
    <section id="roadmap" className="border-t border-linec bg-night-900/40">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <SectionHead
          index="۰۲"
          en="Learning Path"
          title="مسیر یادگیری؛ ترم به ترم، قدم به قدم"
          desc="بزرگ‌ترین دشمن یادگیری، پراکندگی است. این مسیر ۷۴ هفته‌ای، ۲۲ دوره را به ۸ فاز منطقی چیده تا همیشه بدانی الان کجایی و قدم بعدی چیست."
        />

        <div className="grid lg:grid-cols-12 gap-12 mt-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36 space-y-6">
              <Reveal>
                <div className="border border-linec bg-night-900/80 rounded-md p-6 corners always">
                  <p className="font-display text-3xl text-mist leading-snug">
                    <span className="text-amber">{fa(74)}</span> هفته تا استخدام
                  </p>
                  <p className="text-sm text-dim leading-7 mt-3">
                    هر فاز با آزمون تعیین سطح تمام می‌شود و منتور، ورودت به فاز بعد را تأیید می‌کند — دقیقاً مثل پاس‌کردن یک ترم دانشگاه، ولی کاربردی.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {['ترتیب علمی دروس، نه سلیقه‌ای', 'آزمون ورود و خروج هر فاز', 'منتور اختصاصی از فاز ۳'].map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-dim">
                        <span className="text-teal"><IconCheck className="w-4 h-4" /></span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a href="#syllabus" className="group mt-6 flex items-center justify-center gap-2 w-full bg-night-800 border border-linec rounded-md py-3 text-sm font-semibold text-mist hover:border-amber/50 hover:text-amber transition-colors">
                    مشاهده سرفصل دوره جامع
                    <IconArrow className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="border border-linec bg-night-900/80 rounded-md p-5">
                  <p className="text-xs text-faint font-code tracking-widest mb-4">PHASES / ۰۸</p>
                  <div className="grid grid-cols-8 gap-2">
                    {phases.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                        aria-label={p.title}
                        className={`h-9 rounded text-xs font-code transition-all duration-300 border ${
                          i === active
                            ? `bg-night-800 ${NODE[p.hue as Hue]} border-current scale-110 shadow-lg`
                            : 'border-linec text-faint hover:text-dim'
                        }`}
                      >
                        {fa(p.id)}
                      </button>
                    ))}
                  </div>
                  <p className={`mt-4 text-sm font-bold transition-colors ${HUES[phases[active]?.hue as Hue ?? 'amber'].text}`}>
                    {phases[active]?.term}: {phases[active]?.title}
                  </p>
                  <p className="text-xs text-faint mt-1 flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5" />
                    {fa(phases[active]?.weeks ?? 0)} هفته
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8 relative">
            <span className="absolute right-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-teal/40 via-linec to-amber/40" aria-hidden="true" />
            <div className="space-y-8">
              {phases.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => { refs.current[i] = el; }}
                  data-idx={i}
                >
                  <Reveal delay={60}>
                    <div className="flex gap-6">
                      <span className={`relative z-10 shrink-0 w-12 h-12 rounded-full grid place-items-center font-code font-bold bg-night-800 border-2 transition-all duration-500 ${NODE[p.hue as Hue]} ${i === active ? 'scale-110 shadow-[0_0_24px_rgba(255,180,84,0.15)]' : 'opacity-70'}`}>
                        {fa(p.id)}
                      </span>
                      <div className="group flex-1 border border-linec bg-night-900/70 rounded-md p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mist/25">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`font-code text-[10px] tracking-[0.25em] border rounded px-2 py-0.5 ${HUES[p.hue as Hue].chip}`}>{p.term}</span>
                          <span className="text-xs text-faint flex items-center gap-1"><IconClock className="w-3.5 h-3.5" /> {fa(p.weeks)} هفته</span>
                        </div>
                        <h3 className="font-display text-2xl text-mist mt-3">{p.title}</h3>
                        <p className="text-sm text-dim leading-8 mt-2">{p.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {p.tags.map((t) => (
                            <span key={t} className="text-[11px] text-dim border border-linec bg-night-800/70 rounded px-2.5 py-1 hover:border-linec hover:text-mist transition-colors cursor-default">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
