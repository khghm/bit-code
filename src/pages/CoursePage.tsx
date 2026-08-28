import { useParams, Link } from 'react-router-dom';
import { useCourse, useLessons, useProgress, useEnrollments } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import type { Block, Lesson, Quiz } from '../lib/content-types';
import { HUES, LevelBar, Stars } from '../components/Shared';
import { CatIcon, IconArrow, IconCheck, IconClock, IconSession, IconUsers } from '../components/Icons';
import CodeBlock from '../components/CodeBlock';
import Visual from '../components/Visuals';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthModal from '../components/AuthModal';
import { useState, useRef } from 'react';

type Hue = 'amber' | 'teal' | 'cyan' | 'coral';
type Level = 'مقدماتی' | 'متوسط' | 'پیشرفته';

function BlockView({ b, first }: { b: Block; first: boolean }) {
  switch (b.k) {
    case 'p':
      return <p className={`text-dim text-[15px] mb-5 ${first ? 'dropcap' : ''}`}>{b.t}</p>;
    case 'h':
      return (
        <h3 className="font-display text-2xl text-mist mt-9 mb-4 flex items-center gap-3">
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 shrink-0 text-amber" aria-hidden="true">
            <rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {b.t}
        </h3>
      );
    case 'list':
      return (
        <ul className="space-y-2.5 mb-6">
          {b.items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-dim text-[14.5px] leading-8">
              <span className="text-teal mt-1 shrink-0">
                <svg viewBox="0 0 8 8" className="w-2 h-2"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor" /></svg>
              </span>
              {it}
            </li>
          ))}
        </ul>
      );
    case 'code':
      return <CodeBlock code={b.code} lang={b.lang} title={b.title} />;
    case 'tip':
      return (
        <aside className="pop-in border-s-4 border-teal bg-teal/5 rounded-md p-5 mb-6">
          <p className="flex items-center gap-2 font-bold text-teal text-sm mb-2">
            {b.title}
          </p>
          <p className="text-dim text-[14px] leading-8">{b.t}</p>
        </aside>
      );
    case 'warn':
      return (
        <aside className="pop-in border-s-4 border-coral bg-coral/5 rounded-md p-5 mb-6">
          <p className="flex items-center gap-2 font-bold text-coral text-sm mb-2">
            {b.title}
          </p>
          <p className="text-dim text-[14px] leading-8">{b.t}</p>
        </aside>
      );
    case 'def':
      return (
        <aside className="pop-in border border-amber/30 bg-amber/5 rounded-md p-5 mb-6 corners always">
          <p className="font-display text-lg text-amber mb-1.5">{b.term}</p>
          <p className="text-dim text-[14px] leading-8">{b.t}</p>
        </aside>
      );
    case 'table':
      return (
        <div className="overflow-x-auto rounded-md border border-linec mb-6">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-night-800/90 text-right">
                {b.head.map((h) => (
                  <th key={h} className="font-bold text-amber px-4 py-3 text-[13px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className={`border-t border-linec/70 transition-colors hover:bg-night-800/50 ${ri % 2 ? 'bg-night-900/40' : ''}`}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3 text-[13px] ${ci === 0 ? 'font-bold text-mist font-code' : 'text-dim'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'visual':
      return (
        <figure className="my-7 border border-linec rounded-md bg-night-950/80 overflow-hidden">
          <figcaption className="flex items-center justify-between gap-3 px-5 py-3 border-b border-linec bg-night-800/60">
            <span className="font-bold text-[13px] text-amber">{b.title}</span>
            <span className="flex items-center gap-1.5 text-[9px] font-code text-teal border border-teal/30 bg-teal/5 rounded px-2 py-1 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-teal glow-pulse" />
              INTERACTIVE
            </span>
          </figcaption>
          <div className="p-5">
            <Visual name={b.visual} />
          </div>
        </figure>
      );
    default:
      return null;
  }
}

function QuizView({ quiz, lessonDone }: { quiz: Quiz[]; lessonDone: boolean }) {
  const [picks, setPicks] = useState<(number | null)[]>(quiz.map(() => null));

  const answered = picks.filter((p) => p !== null).length;
  const correct = picks.filter((p, i) => p === quiz[i].ans).length;
  const allDone = answered === quiz.length;

  return (
    <div className="mt-12 border-t border-linec pt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="font-code text-amber text-xs tracking-[0.25em] border border-amber/30 bg-amber/5 px-2.5 py-1 rounded">QUIZ</span>
        <h3 className="font-display text-2xl text-mist">خودت را بسنج</h3>
        <span className="text-xs text-faint mr-auto font-code">{answered}/{quiz.length}</span>
      </div>

      <div className="space-y-6">
        {quiz.map((q, qi) => {
          const pick = picks[qi];
          return (
            <div key={qi} className="border border-linec bg-night-900/70 rounded-md p-5">
              <p className="font-bold text-mist text-[15px] mb-4">
                <span className="font-code text-faint text-xs ml-2">{qi + 1}.</span>
                {q.q}
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {q.opts.map((opt, oi) => {
                  const isPick = pick === oi;
                  const isAns = q.ans === oi;
                  const revealed = pick !== null;
                  let cls = 'border-linec text-dim hover:border-amber/50 hover:text-mist';
                  if (revealed && isAns) cls = 'border-teal/60 bg-teal/10 text-teal';
                  else if (revealed && isPick && !isAns) cls = 'border-coral/60 bg-coral/10 text-coral';
                  else if (revealed) cls = 'border-linec text-faint opacity-60';
                  return (
                    <button
                      key={oi}
                      disabled={revealed}
                      onClick={() => setPicks((prev) => prev.map((p, i) => (i === qi ? oi : p)))}
                      className={`text-right text-[13.5px] leading-7 rounded-md border px-4 py-3 transition-all duration-300 ${cls} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="inline-flex items-start gap-2.5">
                        <span className={`shrink-0 w-5 h-5 grid place-items-center rounded-full border text-[10px] font-code mt-1 ${revealed && isAns ? 'border-teal bg-teal text-night-900' : revealed && isPick ? 'border-coral bg-coral text-night-900' : 'border-linec'}`}>
                          {revealed && isAns ? '✓' : revealed && isPick ? '✗' : oi + 1}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {pick !== null && (
                <p className={`pop-in text-[13px] leading-8 mt-4 rounded-md px-4 py-3 border ${pick === q.ans ? 'text-teal border-teal/30 bg-teal/5' : 'text-coral border-coral/30 bg-coral/5'}`}>
                  <b>{pick === q.ans ? 'آفرین، درست است! ' : 'اشتباه شد. '}</b>
                  {q.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="pop-in mt-6 border border-linec rounded-md p-5 flex flex-wrap items-center justify-between gap-4 bg-night-800/60">
          <div>
            <p className="font-display text-2xl text-mist">
              نتیجه: <span className={correct === quiz.length ? 'text-teal' : correct >= 1 ? 'text-amber' : 'text-coral'}>{correct} از {quiz.length}</span>
            </p>
            <p className="text-sm text-dim mt-1">
              {correct === quiz.length
                ? 'بی‌نقص! آماده درس بعدی هستی.'
                : correct >= 1
                  ? 'خوب بود؛ توضیح پاسخ‌های اشتباه را یک بار دیگر بخوان.'
                  : 'اشکالی ندارد — درس را مرور کن و دوباره امتحان کن.'}
            </p>
          </div>
          {!lessonDone && (
            <button
              onClick={() => setPicks(quiz.map(() => null))}
              className="text-sm border border-linec text-dim rounded-md px-5 py-2.5 hover:border-amber/50 hover:text-amber transition-colors"
            >
              تلاش دوباره
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { course, loading: courseLoading } = useCourse(courseId);
  const { lessons, loading: lessonsLoading } = useLessons(courseId);
  const { completedLessons, toggleLesson } = useProgress(user?.id, courseId);
  const { enrolledCourseIds, toggleEnroll } = useEnrollments(user?.id);
  const [lessonIdx, setLessonIdx] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  if (courseLoading || lessonsLoading) {
    return <LoadingSpinner />;
  }

  if (!course || lessons.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 pt-48 pb-32 text-center">
        <p className="font-display text-4xl text-mist">محتوای این دوره در حال آماده‌سازی است</p>
        <p className="text-dim mt-4 leading-8">درس‌نامه این دوره به‌زودی منتشر می‌شود؛ تا آن زمان دوره‌های دیگر را ببین.</p>
        <Link
          to="/courses"
          className="mt-8 inline-flex items-center gap-2 bg-amber text-night-900 font-bold rounded-md px-7 py-3 hover:bg-[#ffc775] transition-colors"
        >
          بازگشت به فهرست دوره‌ها
        </Link>
      </main>
    );
  }

  const lesson = lessons[lessonIdx];
  const doneCount = lessons.filter((l) => completedLessons.includes(l.id)).length;
  const pct = Math.round((doneCount / lessons.length) * 100);
  const isEnrolled = enrolledCourseIds.has(course.id);
  const hue = HUES[course.hue as Hue];

  const handleToggleLesson = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await toggleLesson(lesson.id);
  };

  const handleEnroll = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await toggleEnroll(course.id);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div ref={topRef} className="scroll-mt-36" />

      <Link to="/courses" className="group flex items-center gap-2 text-sm text-dim hover:text-amber transition-colors mb-7">
        <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        بازگشت به فهرست دوره‌ها
      </Link>

      <div className="border border-linec bg-night-900/70 rounded-md p-7 sm:p-9 corners always">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[260px]">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 text-[11px] font-semibold border rounded px-2.5 py-1 ${hue.chip}`}>
                <CatIcon k={course.cat} className="w-3.5 h-3.5" />
                {course.cat}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-dim">
                <LevelBar level={course.level as Level} />
                {course.level}
              </span>
            </div>
            <h1 className={`font-display text-4xl sm:text-5xl leading-[1.3] mt-4 text-mist ${hue.text}`}>{course.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-sm text-dim">
              <span className="font-bold text-mist">{course.instructor}</span>
              <span className="flex items-center gap-1.5"><IconClock className="w-4 h-4 text-faint" /> {course.hours} ساعت</span>
              <span className="flex items-center gap-1.5"><IconSession className="w-4 h-4 text-faint" /> {lessons.length} درس تعاملی</span>
              <span className="flex items-center gap-1.5"><IconUsers className="w-4 h-4 text-faint" /> {course.students}</span>
              <span className="flex items-center gap-1.5"><Stars value={course.rating} /> <b className="text-mist">{course.rating}</b></span>
            </div>
          </div>

          <div className="w-full sm:w-64 shrink-0 border border-linec bg-night-800/60 rounded-md p-5">
            <p className="text-xs text-faint mb-3">پیشرفت شما در این دوره</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-night-600)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={doneCount === lessons.length ? 'var(--color-teal)' : 'var(--color-amber)'} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 97.4} 97.4`} className="transition-all duration-700" />
                </svg>
                <span className="absolute inset-0 grid place-items-center font-code text-xs text-mist">{pct}٪</span>
              </div>
              <div className="text-sm text-dim">
                <b className="text-mist block">{doneCount} از {lessons.length} درس</b>
                {doneCount === lessons.length ? (
                  <span className="text-teal text-xs font-bold">دوره تمام شد! 🎉</span>
                ) : (
                  <span className="text-xs text-faint">ادامه بده!</span>
                )}
              </div>
            </div>
            <button
              onClick={handleEnroll}
              className={`w-full mt-5 text-sm font-bold rounded-md py-3 transition-all duration-300 border ${
                isEnrolled
                  ? 'bg-teal/10 text-teal border-teal/50'
                  : 'bg-amber text-night-900 border-amber hover:bg-[#ffc775] hover:-translate-y-0.5'
              }`}
            >
              {isEnrolled ? '✓ ثبت‌نام شده‌ای' : 'ثبت‌نام در دوره'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mt-10">
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="lg:sticky lg:top-32 space-y-5">
            <div className="border border-linec bg-night-900/70 rounded-md p-5">
              <p className="text-xs text-faint font-code tracking-widest mb-4">LESSONS / {lessons.length}</p>
              <ul className="space-y-2">
                {lessons.map((l, i) => {
                  const isDone = completedLessons.includes(l.id);
                  const isActive = i === lessonIdx;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setLessonIdx(i)}
                        className={`w-full text-right rounded-md border px-4 py-3 transition-all duration-300 flex items-start gap-3 ${
                          isActive
                            ? 'border-amber/60 bg-amber/5'
                            : 'border-linec hover:border-mist/25'
                        }`}
                      >
                        <span className={`shrink-0 w-6 h-6 grid place-items-center rounded-full border text-[10px] font-code mt-0.5 transition-colors ${
                          isDone ? 'bg-teal border-teal text-night-900' : isActive ? 'border-amber text-amber' : 'border-linec text-faint'
                        }`}>
                          {isDone ? '✓' : i + 1}
                        </span>
                        <span className="flex-1">
                          <span className={`block text-[13.5px] font-semibold leading-6 ${isActive ? 'text-amber' : 'text-mist'}`}>{l.title}</span>
                          <span className="block text-[11px] text-faint mt-0.5">{l.minutes} دقیقه · {l.quiz.length} سوال</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 order-1 lg:order-2 min-w-0">
          <article key={lesson.id} className="pop-in lesson-content">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`font-code text-[11px] border rounded px-2.5 py-1 ${completedLessons.includes(lesson.id) ? 'border-teal/50 bg-teal/10 text-teal' : 'border-linec text-faint'}`}>
                {completedLessons.includes(lesson.id) ? '✓ خوانده شد' : 'در حال مطالعه'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-faint">
                <IconClock className="w-3.5 h-3.5" />
                {lesson.minutes} دقیقه
              </span>
              <span className="flex items-center gap-1.5 text-xs text-faint">
                <IconSession className="w-3.5 h-3.5" />
                {lesson.quiz.length} سوال کوییز
              </span>
            </div>

            <h2 className="font-display text-4xl text-mist leading-[1.3] mt-5">{lesson.title}</h2>

            <div className="mt-7">
              {(lesson.blocks as Block[]).map((b, i) => (
                <BlockView key={i} b={b} first={i === 0} />
              ))}
            </div>

            <QuizView quiz={lesson.quiz as unknown as Quiz[]} lessonDone={completedLessons.includes(lesson.id)} />

            <div className="mt-10 border-t border-linec pt-7 flex flex-wrap items-center gap-3">
              {lessonIdx > 0 && (
                <button onClick={() => setLessonIdx(lessonIdx - 1)} className="flex items-center gap-2 border border-linec text-dim text-sm rounded-md px-5 py-3 hover:border-amber/50 hover:text-amber transition-colors">
                  درس قبلی
                </button>
              )}
              <button
                onClick={handleToggleLesson}
                className={`flex items-center gap-2 text-sm font-bold rounded-md px-6 py-3 transition-all duration-300 border ${
                  completedLessons.includes(lesson.id)
                    ? 'bg-teal/10 text-teal border-teal/50'
                    : 'bg-amber text-night-900 border-amber hover:bg-[#ffc775] hover:-translate-y-0.5'
                }`}
              >
                {completedLessons.includes(lesson.id) && <IconCheck className="w-4 h-4" />}
                {completedLessons.includes(lesson.id) ? 'این درس را خواندی' : 'علامت‌گذاری: خواندم'}
              </button>
              {lessonIdx < lessons.length - 1 && (
                <button onClick={() => setLessonIdx(lessonIdx + 1)} className="group flex items-center gap-2 bg-night-800 border border-linec text-mist text-sm font-semibold rounded-md px-5 py-3 mr-auto transition-all hover:border-teal/50 hover:text-teal">
                  درس بعدی
                  <IconArrow className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </button>
              )}
              {lessonIdx === lessons.length - 1 && (
                <span className="mr-auto text-sm font-bold text-amber">پایان دروس این دوره 🎓</span>
              )}
            </div>
          </article>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </main>
  );
}
