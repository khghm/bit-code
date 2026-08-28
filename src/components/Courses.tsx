import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Database } from '../types/database';
import { Reveal, fa, faGroup } from '../lib/hooks';
import { CatIcon, IconCheck, IconClock, IconPlay, IconSearch, IconSession, IconSpark, IconUsers } from './Icons';
import { HUES, LevelBar, SectionHead, Stars } from './Shared';

type Course = Database['public']['Tables']['courses']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Hue = 'amber' | 'teal' | 'cyan' | 'coral';
type Level = 'مقدماتی' | 'متوسط' | 'پیشرفته';

const HUE_HOVER: Record<Hue, { card: string; title: string }> = {
  amber: { card: 'hover:border-amber/50', title: 'group-hover:text-amber' },
  teal: { card: 'hover:border-teal/50', title: 'group-hover:text-teal' },
  cyan: { card: 'hover:border-cyan/50', title: 'group-hover:text-cyan' },
  coral: { card: 'hover:border-coral/50', title: 'group-hover:text-coral' },
};

interface CoursesProps {
  courses: Course[];
  categories?: Category[];
  enrolledCourseIds?: Set<string>;
  onToggleEnroll?: (id: string) => void;
  onAuthRequired?: () => void;
}

export default function Courses({
  courses,
  categories = [],
  enrolledCourseIds = new Set(),
  onToggleEnroll,
  onAuthRequired,
}: CoursesProps) {
  const [cat, setCat] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim();
    return courses.filter((c) => {
      if (cat !== 'all' && c.cat !== cat) return false;
      if (!q) return true;
      return `${c.title} ${c.skills.join(' ')} ${c.instructor}`.includes(q);
    });
  }, [cat, query, courses]);

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? '';

  return (
    <section id="courses" className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          index="۰۱"
          en="Course Catalog"
          title="تمام دروس مهندسی نرم‌افزار، یک‌جا"
          desc="از پایتون تا کوبرنتیز؛ هر دوره با پروژه واقعی، تمرین خودسنج و Code Review انسانی همراه است. فیلتر کن، جست‌وجو کن و مسیرت را بساز."
        />
        <Reveal delay={150}>
          <div className="flex items-center gap-2 text-sm text-dim border border-linec rounded-md px-4 py-3 bg-night-900/60">
            <span className="w-2 h-2 rounded-full bg-amber glow-pulse" />
            <span>
              {enrolledCourseIds.size > 0 ? (
                <>دوره‌های انتخابی شما: <b className="text-amber">{fa(enrolledCourseIds.size)}</b></>
              ) : (
                <>هنوز دوره‌ای انتخاب نکرده‌ای</>
              )}
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCat('all')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 border ${
                cat === 'all'
                  ? 'bg-amber text-night-900 border-amber font-bold shadow-[0_6px_20px_rgba(255,180,84,0.25)]'
                  : 'border-linec text-dim hover:border-amber/40 hover:text-mist'
              }`}
            >
              همه دوره‌ها
              <span className={`font-code text-[10px] px-1.5 py-0.5 rounded ${cat === 'all' ? 'bg-night-900/15 text-night-900' : 'bg-night-800 text-faint'}`}>
                {fa(courses.length)}
              </span>
            </button>
            {categories.map((c) => {
              const active = cat === c.id;
              const count = courses.filter((x) => x.cat === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 border ${
                    active
                      ? 'bg-amber text-night-900 border-amber font-bold shadow-[0_6px_20px_rgba(255,180,84,0.25)]'
                      : 'border-linec text-dim hover:border-amber/40 hover:text-mist'
                  }`}
                >
                  {c.label}
                  <span className={`font-code text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-night-900/15 text-night-900' : 'bg-night-800 text-faint'}`}>
                    {fa(count)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative lg:mr-auto lg:w-72">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجوی دوره، مهارت یا استاد…"
              className="w-full bg-night-900 border border-linec rounded-md pr-10 pl-4 py-2.5 text-sm text-mist placeholder:text-faint outline-none transition-colors focus:border-amber/60"
            />
          </div>
        </div>
      </Reveal>

      <p className="text-xs text-faint mt-5 font-code">
        {faGroup(filtered.length)} دوره پیدا شد {query.trim() && <>برای «{query.trim()}»</>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {filtered.map((c, i) => {
            const hue = HUES[c.hue as Hue];
            const isEnrolled = enrolledCourseIds.has(c.id);
            return (
              <Reveal key={c.id} delay={(i % 3) * 90}>
                <article
                  className={`group corners h-full flex flex-col border border-linec bg-night-900/70 rounded-md p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(2,8,16,0.5)] ${HUE_HOVER[c.hue as Hue].card}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 text-[11px] font-semibold border rounded px-2.5 py-1 ${hue.chip}`}>
                      <CatIcon k={c.cat} className="w-3.5 h-3.5" />
                      {catLabel(c.cat)}
                    </span>
                    {c.popular ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-night-900 bg-amber rounded px-2 py-1">
                        <IconSpark className="w-3 h-3" />
                        پرطرفدار
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-dim">
                        <LevelBar level={c.level as Level} />
                        {c.level}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/course/${c.id}`}
                    className={`font-display text-[22px] leading-9 mt-4 text-mist transition-colors ${HUE_HOVER[c.hue as Hue].title}`}
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-faint mt-1">{c.instructor}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.skills.map((s) => (
                      <span key={s} className="text-[10.5px] text-dim border border-linec rounded px-2 py-0.5 bg-night-800/60">{s}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 text-xs text-dim">
                    <span className="flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5 text-faint" /> {fa(c.hours)} ساعت</span>
                    <span className="flex items-center gap-1.5"><IconSession className="w-3.5 h-3.5 text-faint" /> {fa(c.sessions)} جلسه</span>
                    <span className="flex items-center gap-1.5"><IconUsers className="w-3.5 h-3.5 text-faint" /> {faGroup(c.students)} دانشجو</span>
                    <span className="flex items-center gap-1.5"><Stars value={c.rating} className="w-3 h-3" /> <b className="text-mist">{fa(c.rating)}</b></span>
                  </div>

                  <div className="mt-auto pt-5 border-t border-linec/70">
                    <div className="flex items-center justify-between gap-2">
                      {c.price === 0 ? (
                        <span className="font-bold text-teal">رایگان</span>
                      ) : (
                        <span className="text-sm">
                          <b className="text-mist font-display text-lg">{faGroup(c.price)}</b>
                          <span className="text-faint text-xs mr-1">تومان</span>
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/course/${c.id}`}
                          className={`group flex items-center gap-1.5 text-sm font-semibold rounded-md px-3.5 py-2 transition-all duration-300 border ${hue.chip} hover:-translate-y-0.5`}
                        >
                          <IconPlay className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                          مشاهده محتوا
                        </Link>
                        {onToggleEnroll && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isEnrolled && onAuthRequired) {
                                onAuthRequired();
                              } else {
                                onToggleEnroll(c.id);
                              }
                            }}
                            className={`flex items-center gap-1.5 text-sm font-semibold rounded-md px-4 py-2 transition-all duration-300 border ${
                              isEnrolled
                                ? 'bg-teal/10 text-teal border-teal/40'
                                : 'border-linec text-dim hover:bg-amber hover:text-night-900 hover:border-amber hover:font-bold'
                            }`}
                          >
                            {isEnrolled && <IconCheck className="w-4 h-4" />}
                            {isEnrolled ? 'ثبت شدی!' : 'ثبت‌نام'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-linec rounded-md p-14 text-center mt-6">
          <p className="font-display text-2xl text-dim">چیزی پیدا نشد!</p>
          <p className="text-sm text-faint mt-2">عبارت دیگری را امتحان کن یا فیلترها را پاک کن.</p>
          <button
            onClick={() => { setQuery(''); setCat('all'); }}
            className="mt-5 text-sm text-amber border border-amber/40 rounded-md px-5 py-2 hover:bg-amber hover:text-night-900 transition-colors"
          >
            پاک‌کردن فیلترها
          </button>
        </div>
      )}
    </section>
  );
}
