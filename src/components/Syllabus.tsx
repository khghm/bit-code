import { useState } from 'react';
import type { Database } from '../types/database';
import { Reveal, fa } from '../lib/hooks';
import { IconCheck, IconClock, IconSession, IconShield, IconCert, IconBranch } from './Icons';
import { SectionHead } from './Shared';

const syllabus = [
  { id: 1, title: 'تفکر مهندسی و چرخه حیات نرم‌افزار', hours: 6, lessons: ['نرم‌افزار چیست و چرا «مهندسی»؟', 'چرخه‌های حیات: از آبشاری تا چابک', 'نقش‌های تیم نرم‌افزاری', 'اقتصاد نرم‌افزار و برآورد هزینه'] },
  { id: 2, title: 'مهندسی نیازمندی‌ها', hours: 8, lessons: ['استخراج نیازمندی‌ها و مصاحبه با ذی‌نفع', 'نوشتن User Story و سناریو', 'تحلیل ریسک و امکان‌سنجی', 'مدیریت تغییر نیازمندی‌ها'] },
  { id: 3, title: 'مدل‌سازی با UML', hours: 8, lessons: ['کلاس‌دیاگرام و روابط چهارگانه', 'نمودار Sequence و Activity', 'نمودار حالت و اجزا', 'از مدل تا اسکلت کد'] },
  { id: 4, title: 'معماری نرم‌افزار', hours: 10, lessons: ['لایه‌بندی و Clean Architecture', 'معماری رویدادمحور و Message Queue', 'میکروسرویس در برابر مونولیت', 'ویژگی‌های کیفی: مقیاس‌پذیری و دسترس‌پذیری', 'مستندسازی تصمیمات معماری (ADR)'] },
  { id: 5, title: 'الگوهای طراحی و کد تمیز', hours: 9, lessons: ['اصول SOLID در عمق', 'الگوهای ساختاری: از Adapter تا Decorator', 'الگوهای رفتاری: Strategy و Observer', 'Refactor بدون ترس با تست'] },
  { id: 6, title: 'توسعه چابک و اسکرام', hours: 6, lessons: ['اسپرینت و مراسم اسکرام', 'بورد کانبان و جریان کار', 'برآورد با Story Point', 'ابزارها: از Jira تا Linear'] },
  { id: 7, title: 'تست، کیفیت و DevOps', hours: 9, lessons: ['هرم تست و انواع تست', 'TDD عملی با مثال واقعی', 'CI/CD با GitHub Actions', 'داکر برای توسعه‌دهنده‌ها'] },
  { id: 8, title: 'نگهداری، تکامل و پروژه پایانی', hours: 6, lessons: ['بدهی فنی و مدیریت آن', 'مانیتورینگ و Observability', 'طراحی و پیاده‌سازی پروژه پایانی', 'دفاع از پروژه و دریافت گواهی'] },
];

const TOTAL_HOURS = syllabus.reduce((s, m) => s + m.hours, 0);
const TOTAL_LESSONS = syllabus.reduce((s, m) => s + m.lessons.length, 0);

export default function Syllabus() {
  const [openId, setOpenId] = useState<number>(1);
  const [enrolled, setEnrolled] = useState(false);

  return (
    <section id="syllabus" className="border-t border-linec">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <SectionHead
          index="۰۳"
          en="Full Syllabus"
          title="دوره جامع مهندسی نرم‌افزار، زیر ذره‌بین"
          desc="پرچم‌دار دوره‌های بیت‌کد؛ هر سرفصلش را باز کن و ببین دقیقاً چه چیزی یاد می‌گیری. شفافیت کامل، چون به محتوایمان مطمئنیم."
        />

        <div className="grid lg:grid-cols-12 gap-10 mt-14">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="lg:sticky lg:top-36 border border-linec bg-night-900/80 rounded-md corners always overflow-hidden">
                <div className="bg-night-800/80 border-b border-linec p-6">
                  <span className="font-code text-[10px] tracking-[0.3em] text-teal">FLAGSHIP COURSE</span>
                  <h3 className="font-display text-3xl text-mist mt-2 leading-snug">مهندسی نرم‌افزار جامع؛ از نیازمندی تا استقرار</h3>
                  <p className="text-xs text-faint mt-2">دکتر آرش کمالی · به‌روزرسانی اسفند ۱۴۰۴</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <IconClock className="w-4 h-4" />, v: `${fa(TOTAL_HOURS)} ساعت`, l: 'آموزش ویدیویی' },
                      { icon: <IconSession className="w-4 h-4" />, v: `${fa(TOTAL_LESSONS)} درس`, l: `در ${fa(8)} ماژول` },
                      { icon: <IconBranch className="w-4 h-4" />, v: `${fa(6)} پروژه`, l: 'با Code Review' },
                      { icon: <IconCert className="w-4 h-4" />, v: 'گواهی رسمی', l: 'با کد استعلام' },
                    ].map((x) => (
                      <div key={x.l} className="border border-linec rounded-md p-3 bg-night-800/40">
                        <span className="text-amber flex justify-end">{x.icon}</span>
                        <p className="font-bold text-mist text-sm mt-1.5">{x.v}</p>
                        <p className="text-[11px] text-faint">{x.l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <p className="text-xs text-faint line-through">{fa('3,900,000')} تومان</p>
                      <p className="font-display text-3xl text-mist">{fa('2,950,000')} <span className="text-xs font-body text-faint">تومان</span></p>
                    </div>
                    <span className="text-[11px] font-bold text-night-900 bg-coral rounded px-2 py-1 mb-1">٪۲۵ تخفیف ترم</span>
                  </div>

                  <button
                    onClick={() => setEnrolled((v) => !v)}
                    className={`w-full flex items-center justify-center gap-2 rounded-md py-3.5 font-bold transition-all duration-300 ${
                      enrolled
                        ? 'bg-teal/10 text-teal border border-teal/40'
                        : 'bg-amber text-night-900 hover:bg-[#ffc775] hover:shadow-[0_10px_28px_rgba(255,180,84,0.3)] hover:-translate-y-0.5'
                    }`}
                  >
                    {enrolled && <IconCheck className="w-5 h-5" />}
                    {enrolled ? 'در لیست دوره‌های توست!' : 'ثبت‌نام در دوره جامع'}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-faint">
                    <IconShield className="w-3.5 h-3.5 text-teal" />
                    ضمانت بازگشت وجه تا ۷ روز، بدون هیچ سوالی
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-3">
              {syllabus.map((m, i) => {
                const open = openId === m.id;
                return (
                  <Reveal key={m.id} delay={i * 50}>
                    <div className={`border rounded-md transition-colors duration-300 ${open ? 'border-amber/50 bg-night-900/90' : 'border-linec bg-night-900/60 hover:border-mist/25'}`}>
                      <button
                        onClick={() => setOpenId(open ? -1 : m.id)}
                        className="w-full flex items-center gap-4 p-5 text-right"
                        aria-expanded={open}
                      >
                        <span className={`font-code text-sm w-10 shrink-0 ${open ? 'text-amber' : 'text-faint'}`}>{fa(String(m.id).padStart(2, '0'))}</span>
                        <span className="flex-1">
                          <span className={`font-bold text-[15px] block transition-colors ${open ? 'text-amber' : 'text-mist'}`}>{m.title}</span>
                          <span className="text-[11px] text-faint mt-0.5 block">{fa(m.lessons.length)} درس · {fa(m.hours)} ساعت</span>
                        </span>
                        <span className={`w-8 h-8 shrink-0 grid place-items-center border rounded transition-all duration-300 ${open ? 'border-amber/50 text-amber rotate-45' : 'border-linec text-faint'}`}>
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                        </span>
                      </button>
                      <div className={`acc-panel ${open ? 'open' : ''}`}>
                        <div>
                          <ul className="px-5 pb-5 pr-[4.7rem] space-y-2.5">
                            {m.lessons.map((l, li) => (
                              <li key={l} className="flex items-center gap-3 text-sm text-dim">
                                <span className="text-teal shrink-0"><IconCheck className="w-4 h-4" /></span>
                                <span className="flex-1">{l}</span>
                                <span className="font-code text-[10px] text-faint">{fa(String(li + 1).padStart(2, '0'))}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
