import type { Database } from '../types/database';
import { Reveal, fa, faGroup } from '../lib/hooks';
import { IconQuote } from './Icons';
import { HUES, SectionHead, Stars } from './Shared';

type Mentor = Database['public']['Tables']['mentors']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type Hue = 'amber' | 'teal' | 'cyan' | 'coral';

const AVATAR: Record<Hue, string> = {
  amber: 'bg-amber/12 text-amber border-amber/40',
  teal: 'bg-teal/12 text-teal border-teal/40',
  cyan: 'bg-cyan/12 text-cyan border-cyan/40',
  coral: 'bg-coral/12 text-coral border-coral/40',
};

const CARD_HOVER: Record<Hue, string> = {
  amber: 'hover:border-amber/50',
  teal: 'hover:border-teal/50',
  cyan: 'hover:border-cyan/50',
  coral: 'hover:border-coral/50',
};

interface CommunityProps {
  mentors: Mentor[];
  testimonials: Testimonial[];
}

export default function Community({ mentors, testimonials }: CommunityProps) {
  return (
    <>
      <section id="mentors" className="border-t border-linec bg-night-900/40">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <SectionHead
            index="۰۴"
            en="Mentors"
            title="از کسانی یاد بگیر که خودشان ساخته‌اند"
            desc="مدرسان بیت‌کد مدرسِ صرف نیستند؛ مهندس‌هایی‌اند که روزی در همین مسیر بودند و حالا کدریوی می‌کنند، نه فقط تدریس."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {mentors.map((m, i) => (
              <Reveal key={m.id} delay={i * 100}>
                <article className={`group corners h-full border border-linec bg-night-900/70 rounded-md p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(2,8,16,0.5)] ${CARD_HOVER[m.hue as Hue]}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-16 h-16 shrink-0 rounded-full grid place-items-center font-display text-2xl border-2 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 ${AVATAR[m.hue as Hue]}`}>
                      {m.initials}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-mist leading-7">{m.name}</h3>
                      <Stars value={m.rating} className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-[12.5px] text-dim leading-6 mt-4">{m.role}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {m.tags.map((t) => (
                      <span key={t} className={`text-[10.5px] border rounded px-2 py-0.5 ${HUES[m.hue as Hue].chip}`}>{t}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-linec/70 text-center">
                    <div>
                      <p className="font-display text-2xl text-mist">{fa(m.courses_count)}</p>
                      <p className="text-[10.5px] text-faint mt-0.5">دوره فعال</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-mist">{faGroup(m.students)}</p>
                      <p className="text-[10.5px] text-faint mt-0.5">دانشجو</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="voices" className="border-t border-linec">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              index="۰۵"
              en="Student Voices"
              title="دانشجوها بهتر از ما تعریف می‌کنند"
              desc="بدون روتوش؛ این‌ها نظراتی‌ است که بعد از پایان ترم پاییز ۱۴۰۴ ثبت شده."
            />
            <Reveal delay={150}>
              <div className="text-left">
                <p className="font-display text-5xl text-amber leading-none">{fa('4.9')}</p>
                <Stars value={5} className="w-4 h-4" />
                <p className="text-xs text-faint mt-1.5">میانگین {faGroup(3840)} نظر ثبت‌شده</p>
              </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 100}>
                <figure className="group h-full flex flex-col border border-linec bg-night-900/70 rounded-md p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40">
                  <span className="text-cyan/60 transition-colors group-hover:text-cyan"><IconQuote className="w-8 h-8" /></span>
                  <blockquote className="text-sm text-dim leading-8 mt-4 flex-1">{t.text}</blockquote>
                  <figcaption className="flex items-center justify-between mt-6 pt-4 border-t border-linec/70">
                    <div>
                      <p className="text-sm font-bold text-mist">{t.name}</p>
                      <p className="text-[11px] text-faint mt-0.5">{t.role}</p>
                    </div>
                    <Stars value={t.stars} className="w-3 h-3" />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
