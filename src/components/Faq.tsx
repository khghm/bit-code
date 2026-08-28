import { useState } from 'react';
import type { Database } from '../types/database';
import { Reveal } from '../lib/hooks';
import { IconTerminal } from './Icons';
import { SectionHead } from './Shared';

type Faq = Database['public']['Tables']['faqs']['Row'];

interface FaqProps {
  faqs: Faq[];
}

export default function Faq({ faqs }: FaqProps) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="border-t border-linec bg-night-900/40">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHead
              index="۰۶"
              en="FAQ"
              title="سوالاتی که همه می‌پرسند"
              desc="اگر جوابت اینجا نیست، تیم پشتیبانی هر روز از ۹ تا ۲۳ آنلاین است — میانگین پاسخ‌گویی ۱۲ دقیقه."
            />
            <Reveal delay={150}>
              <div className="mt-8 border border-linec bg-night-900/80 rounded-md p-6 corners always">
                <span className="w-11 h-11 grid place-items-center rounded-md bg-teal/10 border border-teal/30 text-teal">
                  <IconTerminal className="w-5 h-5" />
                </span>
                <h3 className="font-display text-2xl text-mist mt-4">هنوز سوال داری؟</h3>
                <p className="text-sm text-dim leading-7 mt-2">
                  یک جلسه مشاوره رایگان ۲۰ دقیقه‌ای رزرو کن تا مسیر یادگیری‌ات را بر اساس هدفت (استخدام، مهاجرت، فریلنسری) بچینیم.
                </p>
                <a
                  href="#top"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-night-900 bg-teal rounded-md px-5 py-2.5 transition-all duration-300 hover:bg-[#63e6c8] hover:-translate-y-0.5"
                >
                  رزرو مشاوره رایگان
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={f.id} delay={i * 60}>
                    <div className={`border rounded-md transition-colors duration-300 ${isOpen ? 'border-teal/50 bg-night-900/90' : 'border-linec bg-night-900/60 hover:border-mist/25'}`}>
                      <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center gap-4 p-5 text-right" aria-expanded={isOpen}>
                        <span className="font-code text-xs text-faint w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <span className={`flex-1 font-bold text-[15px] transition-colors ${isOpen ? 'text-teal' : 'text-mist'}`}>{f.question}</span>
                        <span className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal' : 'text-faint'}`}>
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                      </button>
                      <div className={`acc-panel ${isOpen ? 'open' : ''}`}>
                        <div>
                          <p className="px-5 pb-5 pl-12 text-sm text-dim leading-8">{f.answer}</p>
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
