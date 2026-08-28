import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fa, faGroup, usePrefersReducedMotion } from "../lib/hooks";
import { BfsDfs, DpTable, LruCache, OnionArch, Quorum, SeqDiagram, TlsHandshake } from "./Visuals2";
import { AbTestCalc, MktFunnel } from "./Visuals3";
import { SqlJoin, ReactLifecycle, AsyncFlow, NumberConverter, CiCdPipeline, BTreeIndex, ObserverPattern, RateLimiter, HashVsEncrypt } from "./Visuals4";

/* ---------- قاب مشترک ---------- */
function Frame({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <figure className="my-7 border border-linec rounded-md bg-night-950/80 overflow-hidden">
      <figcaption className="flex items-center justify-between gap-3 px-5 py-3 border-b border-linec bg-night-800/60">
        <span className="font-bold text-[13px] text-amber">{title}</span>
        <span className="flex items-center gap-1.5 text-[9px] font-code text-teal border border-teal/30 bg-teal/5 rounded px-2 py-1 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-teal glow-pulse" />
          INTERACTIVE
        </span>
      </figcaption>
      <div className="p-5">{children}</div>
      {hint && <p className="px-5 pb-4 -mt-2 text-[11.5px] leading-6 text-faint">{hint}</p>}
    </figure>
  );
}

function VBtn({ onClick, active, children, disabled }: { onClick: () => void; active?: boolean; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-semibold rounded-md border px-3.5 py-1.5 transition-all duration-200 ${
        active ? "bg-amber text-night-900 border-amber" : "border-linec text-dim hover:border-amber/50 hover:text-amber"
      } ${disabled ? "opacity-40 cursor-default" : ""}`}
    >
      {children}
    </button>
  );
}

function useTicker(on: boolean, ms: number, fn: () => void) {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => cb.current(), ms);
    return () => window.clearInterval(id);
  }, [on, ms]);
}

/* ---------- ۱) نمودار Big-O ---------- */
function BigO() {
  const [n, setN] = useState(16);
  const [shown, setShown] = useState<string[]>(["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"]);
  const reduced = usePrefersReducedMotion();
  const [drawn, setDrawn] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setDrawn(true), 60);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const fns: { name: string; f: (x: number) => number; color: string }[] = [
    { name: "O(1)", f: () => 1, color: "#5ec8ea" },
    { name: "O(log n)", f: (x) => Math.log2(x + 1), color: "#3fd8b6" },
    { name: "O(n)", f: (x) => x, color: "#ffb454" },
    { name: "O(n log n)", f: (x) => x * Math.log2(x + 1), color: "#e8b4ff" },
    { name: "O(n²)", f: (x) => x * x, color: "#ff7a63" },
  ];
  const W = 560, H = 250, P = 14;
  const X = (x: number) => P + ((x - 1) / 63) * (W - 2 * P);
  const Y = (v: number) => H - P - (Math.sqrt(v) / 64) * (H - 2 * P);
  const path = (f: (x: number) => number) => {
    let d = "";
    for (let x = 1; x <= 64; x += 1) d += `${x === 1 ? "M" : "L"}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`;
    return d;
  };

  return (
    <Frame title="نمودار رشد تابع پیچیدگی — n را تغییر بده" hint="محور عمودی ریشه‌دوم گرفته تا همه منحنی‌ها دیده شوند؛ عدد واقعی عملیات زیر نمودار آمده. فاصله O(n²) از بقیه را در n=۶۴ ببین!">
      <div dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={P} x2={W - P} y1={P + g * (H - 2 * P)} y2={P + g * (H - 2 * P)} stroke="rgba(124,178,232,0.12)" strokeDasharray="4 6" />
          ))}
          <line x1={X(n)} x2={X(n)} y1={P} y2={H - P} stroke="#ffb454" strokeWidth="1.2" strokeDasharray="3 5" opacity="0.8" />
          {fns.filter((f) => shown.includes(f.name)).map((c) => (
            <g key={c.name}>
              <path
                d={path(c.f)}
                fill="none"
                stroke={c.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
              />
              <circle cx={X(n)} cy={Y(c.f(n))} r="4.5" fill={c.color} stroke="#050d16" strokeWidth="1.5" style={{ transition: "cx 0.2s, cy 0.2s" }} />
            </g>
          ))}
          <text x={X(n)} y={P - 2} fill="#ffb454" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">n={n}</text>
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {fns.map((c) => (
          <button
            key={c.name}
            onClick={() => setShown((s) => (s.includes(c.name) ? s.filter((x) => x !== c.name) : [...s, c.name]))}
            className="flex items-center gap-2 text-[11px] font-code border rounded-md px-2.5 py-1.5 transition-all"
            style={{ borderColor: shown.includes(c.name) ? c.color : "rgba(124,178,232,0.14)", color: shown.includes(c.name) ? c.color : "#64809c", opacity: shown.includes(c.name) ? 1 : 0.5 }}
          >
            <span className="w-3 h-[3px] rounded-full" style={{ background: c.color }} />
            {c.name}: {faGroup(Math.round(c.f(n)))} عملیات
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3" dir="ltr">
        <span className="font-code text-[11px] text-faint">n=2</span>
        <input type="range" min={2} max={64} value={n} onChange={(e) => setN(+e.target.value)} className="w-full accent-amber" />
        <span className="font-code text-[11px] text-faint">n=64</span>
      </div>
    </Frame>
  );
}

/* ---------- ۲) درج در آرایه ---------- */
function ArrayInsert() {
  const BASE = [10, 22, 31, 44, 55, 60];
  const [arr, setArr] = useState<number[]>(BASE);
  const [phase, setPhase] = useState<"idle" | "shift" | "done">("idle");
  const [shifts, setShifts] = useState(0);
  const tm = useRef(0);
  useEffect(() => () => window.clearTimeout(tm.current), []);

  const insert = () => {
    if (phase !== "idle") return;
    setPhase("shift");
    setShifts(arr.length - 2);
    tm.current = window.setTimeout(() => {
      setArr([10, 22, 25, 31, 44, 55, 60]);
      setPhase("done");
    }, 520);
  };
  const reset = () => { setArr(BASE); setPhase("idle"); setShifts(0); };

  return (
    <Frame title="شبیه‌ساز: درج ۲۵ در ایندکس ۲ آرایه" hint="عنصر جدید جا ندارد؛ همه عناصر از ایندکس ۲ به بعد باید یک خانه شیفت بخورند — هزینه O(n).">
      <div className="flex items-center justify-center gap-2 py-6 min-h-[92px]">
        {arr.map((v, i) => {
          const moving = phase === "shift" && i >= 2;
          const isNew = v === 25;
          return (
            <div key={`${v}-${i}`} className="flex items-center gap-2">
              <div
                className={`relative w-14 h-14 grid place-items-center rounded-md border-2 font-code font-bold text-lg transition-transform duration-500 ease-in-out ${
                  isNew ? "pop-in border-amber bg-amber/10 text-amber" : "border-linec bg-night-800 text-mist"
                }`}
                style={{ transform: moving ? "translateX(-64px)" : "none" }}
              >
                {fa(v)}
                <span className="absolute -bottom-6 text-[10px] text-faint font-code">{fa(i)}</span>
              </div>
            </div>
          );
        })}
        {phase === "shift" && (
          <div className="w-14 h-14 rounded-md border-2 border-dashed border-amber/50 grid place-items-center text-amber text-lg opacity-0 animate-[pop-in_0.5s_0.2s_forwards]">
            {fa(25)}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-6">
        {phase === "done" ? (
          <>
            <span className="text-xs text-teal font-bold">انجام شد — {fa(shifts)} عنصر جابه‌جا شد</span>
            <VBtn onClick={reset}>شروع دوباره</VBtn>
          </>
        ) : (
          <VBtn onClick={insert} active>درج عنصر ۲۵</VBtn>
        )}
      </div>
    </Frame>
  );
}

/* ---------- ۳) لیست پیوندی ---------- */
function LinkedList() {
  const [nodes, setNodes] = useState<number[]>([3, 7, 12, 20]);
  const [counter, setCounter] = useState(0);
  const prepend = () => {
    setNodes((n) => [Math.floor(Math.random() * 40) + 1, ...n].slice(0, 7));
    setCounter((c) => c + 1);
  };
  const removeHead = () => {
    setNodes((n) => (n.length > 1 ? n.slice(1) : n));
    setCounter((c) => c + 1);
  };
  const Arrow = () => (
    <svg viewBox="0 0 26 12" className="w-7 h-3 text-faint shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6H4" /><path d="M8 2 4 6l4 4" />
    </svg>
  );
  return (
    <Frame title="شبیه‌ساز: لیست پیوندی — فقط اشاره‌گرها" hint="درج و حذف در سر لیست فقط جابه‌جایی دو اشاره‌گر است (O(1))؛ هیچ داده‌ای شیفت نمی‌خورد.">
      <div className="flex items-center justify-center gap-1 py-6 flex-wrap min-h-[90px]">
        {nodes.map((v, i) => (
          <div key={`${v}-${i}`} className="flex items-center gap-1">
            <div className={`w-16 rounded-md border-2 ${i === 0 ? "border-teal bg-teal/10" : "border-linec bg-night-800"} ${i === 0 ? "pop-in" : ""}`}>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-linec" dir="ltr">
                <div className="py-2.5 text-center font-code font-bold text-mist">{fa(v)}</div>
                <div className="py-2.5 text-center text-[9px] font-code text-teal grid place-items-center">next</div>
              </div>
            </div>
            {i < nodes.length - 1 && <Arrow />}
          </div>
        ))}
        <span className="font-code text-[10px] text-faint mr-2">null ⟵</span>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <VBtn onClick={prepend} active>درج در سر (O(1))</VBtn>
        <VBtn onClick={removeHead}>حذف سر (O(1))</VBtn>
        <span className="text-[11px] text-faint">عملیات: {fa(counter)}</span>
      </div>
    </Frame>
  );
}

/* ---------- ۴) پشته ---------- */
function Stack() {
  const [items, setItems] = useState<number[]>([12, 34]);
  const push = () => setItems((s) => (s.length < 6 ? [...s, Math.floor(Math.random() * 90) + 5] : s));
  const pop = () => setItems((s) => s.slice(0, -1));
  return (
    <Frame title="شبیه‌ساز پشته — LIFO" hint="آخرین ورودی، اولین خروجی. اشاره‌گر top همیشه به بالای پشته نگاه می‌کند؛ هر دو عمل O(1).">
      <div className="flex items-end justify-center gap-8 py-4">
        <div className="flex flex-col-reverse items-stretch gap-1.5 w-32 min-h-[220px] justify-start border-x-2 border-b-2 border-linec rounded-b-md p-2 bg-night-900/60">
          {items.map((v, i) => (
            <div key={`${v}-${i}`} className={`pop-in text-center py-2.5 rounded font-code font-bold border ${i === items.length - 1 ? "bg-amber/15 border-amber text-amber" : "bg-night-800 border-linec text-dim"}`}>
              {fa(v)}
            </div>
          ))}
        </div>
        <div className="text-right text-[11px] space-y-2 text-faint">
          <p>top = {fa(items.length - 1)}</p>
          <p>اندازه = {fa(items.length)}</p>
          <p className="text-teal">push / pop: O(1)</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <VBtn onClick={push} active disabled={items.length >= 6}>Push</VBtn>
        <VBtn onClick={pop} disabled={items.length === 0}>Pop</VBtn>
        {items.length >= 6 && <span className="text-[11px] text-coral">Stack Overflow!</span>}
      </div>
    </Frame>
  );
}

/* ---------- ۵) صف ---------- */
function Queue() {
  const [items, setItems] = useState<number[]>([5, 18, 27]);
  const enq = () => setItems((s) => (s.length < 7 ? [...s, Math.floor(Math.random() * 90) + 5] : s));
  const deq = () => setItems((s) => s.slice(1));
  return (
    <Frame title="شبیه‌ساز صف — FIFO" hint="مثل صف نانوایی: ورود از ته (enqueue)، خروج از سر (dequeue). هر دو O(1).">
      <div className="py-6">
        <div className="flex items-center justify-center gap-1.5 min-h-[64px] flex-wrap">
          <span className="text-[10px] font-code text-teal ml-2">dequeue ←</span>
          {items.map((v, i) => (
            <div key={`${v}-${i}`} className={`w-13 px-3 py-3 text-center rounded font-code font-bold border ${i === 0 ? "pop-in bg-teal/15 border-teal text-teal" : "bg-night-800 border-linec text-dim"}`}>
              {fa(v)}
            </div>
          ))}
          <span className="text-[10px] font-code text-amber mr-2">→ enqueue</span>
        </div>
        <p className="text-center text-[11px] text-faint mt-4">head = {items[0] !== undefined ? fa(items[0]) : "—"} · طول صف = {fa(items.length)}</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <VBtn onClick={enq} active>Enqueue</VBtn>
        <VBtn onClick={deq} disabled={items.length === 0}>Dequeue</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۶) جست‌وجوی دودویی ---------- */
function BinarySearch() {
  const ARR = [3, 7, 12, 18, 24, 31, 38, 45, 52, 60, 67, 73, 81, 89, 94];
  const [target, setTarget] = useState(67);
  const [st, setSt] = useState({ lo: 0, hi: ARR.length - 1, mid: -1, cnt: 0, done: false, found: -1 });
  const reduced = usePrefersReducedMotion();
  const [auto, setAuto] = useState(false);

  const step = () => {
    setSt((s) => {
      if (s.done) return s;
      if (s.lo > s.hi) return { ...s, done: true, found: -1 };
      const mid = (s.lo + s.hi) >> 1;
      const cnt = s.cnt + 1;
      if (ARR[mid] === target) return { lo: s.lo, hi: s.hi, mid, cnt, done: true, found: mid };
      if (ARR[mid] < target) return { lo: mid + 1, hi: s.hi, mid, cnt, done: false, found: -1 };
      return { lo: s.lo, hi: mid - 1, mid, cnt, done: false, found: -1 };
    });
  };
  useTicker(auto && !st.done && !reduced, 850, step);
  useEffect(() => { if (st.done) setAuto(false); }, [st.done]);

  const reset = (t?: number) => {
    if (t !== undefined) setTarget(t);
    setSt({ lo: 0, hi: ARR.length - 1, mid: -1, cnt: 0, done: false, found: -1 });
    setAuto(false);
  };

  return (
    <Frame title={`جست‌وجوی دودویی — دنبال ${fa(target)} بگرد`} hint="هر مقایسه نصف بازه را حذف می‌کند: ۱۵ عنصر با حداکثر ۴ مقایسه! جست‌وجوی خطی همین را با میانگین ۸ مقایسه انجام می‌دهد.">
      <div className="flex flex-wrap items-center justify-center gap-1.5 py-3" dir="ltr">
        {ARR.map((v, i) => {
          const out = i < st.lo || i > st.hi;
          const isMid = st.mid === i;
          const isFound = st.found === i;
          return (
            <div
              key={v}
              className={`w-9 h-12 grid place-items-center rounded font-code text-[13px] font-bold border-2 transition-all duration-500 ${
                isFound ? "bg-teal/20 border-teal text-teal scale-110" : isMid ? "bg-amber/15 border-amber text-amber scale-110" : out ? "border-linec text-faint opacity-25" : "border-linec bg-night-800 text-mist"
              }`}
            >
              {fa(v)}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-code mt-2">
        <span className="text-teal">lo = {fa(st.lo)}</span>
        <span className="text-amber">mid = {st.mid >= 0 ? fa(st.mid) : "—"}</span>
        <span className="text-cyan">hi = {fa(st.hi)}</span>
        <span className="text-mist">مقایسه‌ها: {fa(st.cnt)}</span>
      </div>
      {st.done && (
        <p className={`pop-in text-center text-sm font-bold mt-3 ${st.found >= 0 ? "text-teal" : "text-coral"}`}>
          {st.found >= 0 ? `پیدا شد! ایندکس ${fa(st.found)} با فقط ${fa(st.cnt)} مقایسه` : `در آرایه نیست — با ${fa(st.cnt)} مقایسه مطمئن شدیم`}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        <VBtn onClick={step} disabled={st.done || auto}>قدم بعدی</VBtn>
        <VBtn onClick={() => setAuto(true)} active={auto} disabled={st.done}>پخش خودکار</VBtn>
        <VBtn onClick={() => reset()}>ریست</VBtn>
        <span className="w-px h-5 bg-linec mx-1" />
        {[24, 67, 94, 50].map((t) => (
          <VBtn key={t} onClick={() => reset(t)} active={target === t}>هدف: {fa(t)}</VBtn>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- ۷) مسابقه مرتب‌سازی ---------- */
interface SortFrame { arr: number[]; cmp: number; changed: number[] }
function recordInsertion(a0: number[]): SortFrame[] {
  const a = [...a0]; const f: SortFrame[] = [{ arr: [...a], cmp: 0, changed: [] }]; let cmp = 0;
  for (let i = 1; i < a.length; i += 1) {
    const key = a[i]; let j = i - 1;
    while (j >= 0) { cmp += 1; if (a[j] > key) { a[j + 1] = a[j]; j -= 1; } else break; }
    a[j + 1] = key;
    f.push({ arr: [...a], cmp, changed: [j + 1, i] });
  }
  return f;
}
function recordQuick(a0: number[]): SortFrame[] {
  const a = [...a0]; const f: SortFrame[] = [{ arr: [...a], cmp: 0, changed: [] }]; let cmp = 0;
  const rec = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const p = a[hi]; let i = lo;
    for (let j = lo; j < hi; j += 1) {
      cmp += 1;
      if (a[j] < p) { const t = a[i]; a[i] = a[j]; a[j] = t; f.push({ arr: [...a], cmp, changed: [i, j] }); i += 1; }
    }
    const t = a[i]; a[i] = a[hi]; a[hi] = t;
    f.push({ arr: [...a], cmp, changed: [i, hi] });
    rec(lo, i - 1); rec(i + 1, hi);
  };
  rec(0, a.length - 1);
  return f;
}
const SEED = [42, 15, 67, 8, 91, 23, 55, 34, 78, 12, 60, 29, 84, 5, 47, 70];

function SortRace() {
  const [alg, setAlg] = useState<"quick" | "insertion">("quick");
  const frames = useMemo(() => (alg === "quick" ? recordQuick(SEED) : recordInsertion(SEED)), [alg]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const reduced = usePrefersReducedMotion();
  useTicker(playing && idx < frames.length - 1, 340 - speed * 28, () => setIdx((i) => Math.min(i + 1, frames.length - 1)));
  useEffect(() => { if (idx >= frames.length - 1) setPlaying(false); }, [idx, frames.length]);

  const frame = frames[idx];
  const restart = (a: "quick" | "insertion") => { setAlg(a); setIdx(0); setPlaying(false); };

  return (
    <Frame title="مسابقه مرتب‌سازی — QuickSort در برابر InsertionSort" hint="هر میله یک عدد است؛ میله‌های کهربایی یعنی همین حالا جابه‌جا شده‌اند. سرعت را زیاد کن و تعداد مقایسه‌ها را مقایسه کن.">
      <div dir="ltr" className="flex items-end gap-[3px] h-40 px-1">
        {frame.arr.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-200"
            style={{
              height: `${(v / 95) * 100}%`,
              background: frame.changed.includes(i) ? "#ffb454" : idx === frames.length - 1 ? "#3fd8b6" : "#16324c",
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-[12px]">
        <span className="text-dim">گام: <b className="text-mist font-code">{fa(idx)}</b> از {fa(frames.length - 1)}</span>
        <span className="text-dim">مقایسه‌ها: <b className="text-amber font-code">{faGroup(frame.cmp)}</b></span>
        {idx === frames.length - 1 && <span className="text-teal font-bold">مرتب شد ✓</span>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <VBtn onClick={() => restart("quick")} active={alg === "quick"}>QuickSort</VBtn>
        <VBtn onClick={() => restart("insertion")} active={alg === "insertion"}>InsertionSort</VBtn>
        <VBtn onClick={() => { if (idx >= frames.length - 1) setIdx(0); setPlaying((p) => !p); }} active={playing}>
          {playing ? "توقف" : "پخش"}
        </VBtn>
        <VBtn onClick={() => { setIdx(0); setPlaying(false); }}>ریست</VBtn>
        {!reduced && (
          <span className="flex items-center gap-2 text-[11px] text-faint" dir="ltr">
            کند
            <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="accent-amber w-24" />
            تند
          </span>
        )}
      </div>
    </Frame>
  );
}

/* ---------- ۸) جدول هش ---------- */
function HashTable() {
  const [table, setTable] = useState<string[][]>(Array.from({ length: 8 }, () => []));
  const [flash, setFlash] = useState(-1);
  const [last, setLast] = useState<{ key: string; sum: number; idx: number } | null>(null);
  const tm = useRef(0);
  useEffect(() => () => window.clearTimeout(tm.current), []);

  const add = (key: string) => {
    const sum = [...key].reduce((s, c) => s + c.charCodeAt(0), 0);
    const idx = sum % 8;
    setTable((t) => t.map((b, i) => (i === idx && !b.includes(key) ? [...b, key] : b)));
    setLast({ key, sum, idx });
    setFlash(idx);
    window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => setFlash(-1), 900);
  };

  return (
    <Frame title="شبیه‌ساز جدول هش — کلید به سطل" hint="هش، کلید را به شماره سطل تبدیل می‌کند؛ خواندن و نوشتن به‌طور متوسط O(1) است چون مستقیم سراغ سطل می‌رویم.">
      <div className="grid grid-cols-8 gap-1.5" dir="ltr">
        {table.map((bucket, i) => (
          <div key={i} className={`rounded-md border-2 p-1.5 min-h-[92px] transition-all duration-300 ${flash === i ? "border-amber bg-amber/10 scale-105" : "border-linec bg-night-900/60"}`}>
            <p className="font-code text-[9px] text-faint text-center mb-1.5">#{fa(i)}</p>
            <div className="space-y-1">
              {bucket.map((k) => (
                <p key={k} className="pop-in font-code text-[9px] text-teal bg-teal/10 border border-teal/30 rounded px-1 py-0.5 text-center truncate">{k}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      {last && (
        <p className="pop-in text-center font-code text-[11px] text-dim mt-4" dir="ltr">
          hash("{last.key}") = {fa(last.sum)} % {fa(8)} = <b className="text-amber">{fa(last.idx)}</b>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4" dir="ltr">
        {["ali", "sara", "omid", "nima", "reza", "tara", "kia", "ava"].map((k) => (
          <VBtn key={k} onClick={() => add(k)}>{k}</VBtn>
        ))}
        <VBtn onClick={() => { setTable(Array.from({ length: 8 }, () => [])); setLast(null); }}>پاک‌کردن</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۹) درخت بازگشت ---------- */
interface TNode { v: number; l: TNode | null; r: TNode | null }
function buildFib(n: number): TNode {
  if (n <= 1) return { v: n, l: null, r: null };
  return { v: n, l: buildFib(n - 1), r: buildFib(n - 2) };
}
function RecursionTree() {
  const [depth, setDepth] = useState(5);
  const SP = 38;
  const { nodes, edges, dup, total, W, H } = useMemo(() => {
    const root = buildFib(depth);
    const ns: { x: number; y: number; v: number }[] = [];
    const es: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const count: Record<number, number> = {};
    const sizeOf = (node: TNode): number => 1 + (node.l ? sizeOf(node.l) : 0) + (node.r ? sizeOf(node.r) : 0);
    const place = (node: TNode, d: number, lo: number, hi: number) => {
      const x = (lo + hi) / 2;
      const i = ns.length;
      count[node.v] = (count[node.v] ?? 0) + 1;
      ns.push({ x, y: d, v: node.v });
      if (node.l) {
        place(node.l, d + 1, lo, x);
        es.push({ x1: x, y1: d, x2: ns[i + 1].x, y2: d + 1 });
      }
      if (node.r) {
        place(node.r, d + 1, x, hi);
        es.push({ x1: x, y1: d, x2: ns[i + (node.l ? sizeOf(node.l) : 0) + 1].x, y2: d + 1 });
      }
    };
    const width = 2 ** depth * SP;
    place(root, 0, 0, width);
    return { nodes: ns, edges: es, dup: count, total: ns.length, W: width, H: (depth + 1) * 58 + 8 };
  }, [depth]);

  const Y = (d: number) => d * 58 + 24;
  return (
    <Frame title="درخت فراخوانی fib(n) — هزینه بازگشت ساده" hint="گره‌های مرجانی یعنی زیرمسئله‌ای که چند بار حل شده! با memoization هر گره فقط یک‌بار حساب می‌شود — از نمایی به خطی. در n بزرگ‌تر، درخت عریض می‌شود و اسکرول افقی می‌خورد.">
      <div dir="ltr" className="overflow-x-auto pb-2">
        <svg width={W} height={H} className="block min-w-full">
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={Y(e.y1)} x2={e.x2} y2={Y(e.y2)} stroke="rgba(124,178,232,0.28)" strokeWidth="1.2" />
          ))}
          {nodes.map((nd, i) => {
            const repeated = dup[nd.v] > 1;
            return (
              <g key={i}>
                <circle cx={nd.x} cy={Y(nd.y)} r="13" fill={repeated ? "rgba(255,122,99,0.18)" : "rgba(63,216,182,0.13)"} stroke={repeated ? "#ff7a63" : "#3fd8b6"} strokeWidth="1.4" />
                <text x={nd.x} y={Y(nd.y) + 4} textAnchor="middle" fontSize="11" fill={repeated ? "#ff7a63" : "#3fd8b6"} fontFamily="JetBrains Mono" fontWeight="700">{nd.v}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-3 text-[12px]">
        <span className="text-dim">فراخوانی‌ها: <b className="text-mist font-code">{fa(total)}</b></span>
        <span className="text-coral">فراخوانی‌های تکراری: <b className="font-code">{fa(Object.values(dup).reduce((s, c) => s + c - 1, 0))}</b></span>
        <span className="text-teal">با memoization: <b className="font-code">{fa(depth + 1)}</b> فراخوانی</span>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4" dir="ltr">
        <span className="font-code text-[11px] text-faint">n=2</span>
        <input type="range" min={2} max={7} value={depth} onChange={(e) => setDepth(+e.target.value)} className="accent-amber w-48" />
        <span className="font-code text-[11px] text-faint">n=7</span>
        <span className="font-code text-[12px] text-amber font-bold">n={fa(depth)}</span>
      </div>
    </Frame>
  );
}

/* ---------- ۱۰) پیمایش درخت BST ---------- */
const BST_POS: Record<number, { x: number; y: number }> = {
  50: { x: 100, y: 20 }, 30: { x: 55, y: 62 }, 70: { x: 145, y: 62 },
  20: { x: 30, y: 104 }, 40: { x: 80, y: 104 }, 60: { x: 120, y: 104 }, 80: { x: 170, y: 104 },
};
const BST_EDGES: [number, number][] = [[50, 30], [50, 70], [30, 20], [30, 40], [70, 60], [70, 80]];
const INORDER = [20, 30, 40, 50, 60, 70, 80];
const PREORDER = [50, 30, 20, 40, 70, 60, 80];

function Bst() {
  const [order, setOrder] = useState<"in" | "pre">("in");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const seq = order === "in" ? INORDER : PREORDER;
  useTicker(playing && step < seq.length - 1, 750, () => setStep((s) => s + 1));
  useEffect(() => { if (step >= seq.length - 1) setPlaying(false); }, [step, seq.length]);

  const start = (o: "in" | "pre") => { setOrder(o); setStep(0); setPlaying(true); };
  const visited = seq.slice(0, step + 1);
  const active = step >= 0 ? seq[step] : -1;

  return (
    <Frame title="پیمایش درخت جست‌وجوی دودویی" hint="میان‌ترتیب (In-order) در BST خروجی مرتب می‌دهد — همین خاصیت ساده، پایه خیلی از مصاحبه‌هاست.">
      <div dir="ltr">
        <svg viewBox="0 0 200 130" className="w-full max-w-[460px] mx-auto">
          {BST_EDGES.map(([a, b]) => (
            <line key={`${a}${b}`} x1={BST_POS[a].x} y1={BST_POS[a].y} x2={BST_POS[b].x} y2={BST_POS[b].y} stroke="rgba(124,178,232,0.25)" strokeWidth="1" />
          ))}
          {Object.entries(BST_POS).map(([v, p]) => {
            const val = +v;
            const isActive = val === active;
            const isVisited = visited.includes(val);
            return (
              <g key={v}>
                <circle cx={p.x} cy={p.y} r="11" fill={isActive ? "rgba(255,180,84,0.25)" : isVisited ? "rgba(63,216,182,0.12)" : "rgba(14,34,54,0.9)"} stroke={isActive ? "#ffb454" : isVisited ? "#3fd8b6" : "#16324c"} strokeWidth="1.6" style={{ transition: "all 0.4s" }} />
                <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9" fill={isActive ? "#ffb454" : isVisited ? "#3fd8b6" : "#9db4c9"} fontFamily="JetBrains Mono" fontWeight="700">{fa(val)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center justify-center gap-1.5 min-h-[34px] mt-2" dir="ltr">
        {visited.map((v, i) => (
          <span key={`${v}-${i}`} className="pop-in font-code text-[11px] bg-teal/10 border border-teal/30 text-teal rounded px-2 py-0.5">{fa(v)}</span>
        ))}
        {step >= seq.length - 1 && <span className="text-teal text-[11px] font-bold mr-2">— خروجی مرتب ✓</span>}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <VBtn onClick={() => start("in")} active={order === "in" && playing}>میان‌ترتیب (مرتب)</VBtn>
        <VBtn onClick={() => start("pre")} active={order === "pre" && playing}>پیش‌ترتیب</VBtn>
        <VBtn onClick={() => { setStep(-1); setPlaying(false); }}>ریست</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۱) گراف Git ---------- */
function GitGraph() {
  const [step, setStep] = useState(0);
  const reduced = usePrefersReducedMotion();
  useTicker(step < 7 && !reduced, 900, () => setStep((s) => s + 1));
  const commits = [
    { id: "A", x: 30, y: 30, main: true, at: 0 },
    { id: "B", x: 80, y: 30, main: true, at: 1 },
    { id: "C", x: 130, y: 58, main: false, at: 2 },
    { id: "D", x: 180, y: 58, main: false, at: 3 },
    { id: "E", x: 230, y: 30, main: true, at: 4 },
  ];
  const vis = (at: number) => ({ opacity: step >= at ? 1 : 0.08, transition: "opacity 0.5s" });
  return (
    <Frame title="مدل Git — شعبه و ادغام به‌صورت زنده" hint="Git زنجیره‌ای از Snapshot است؛ Branch فقط اشاره‌گری متحرک به یک Commit. Merge یعنی یک Commit با دو والد.">
      <div dir="ltr">
        <svg viewBox="0 0 260 88" className="w-full max-w-[520px] mx-auto">
          <line x1={30} y1={30} x2={230} y2={30} stroke="#3fd8b6" strokeWidth="1.5" style={vis(0)} />
          <path d="M80 30 C 100 30 105 58 130 58" fill="none" stroke="#ffb454" strokeWidth="1.5" style={vis(2)} />
          <line x1={130} y1={58} x2={180} y2={58} stroke="#ffb454" strokeWidth="1.5" style={vis(3)} />
          <path d="M180 58 C 205 58 210 30 230 30" fill="none" stroke="#ffb454" strokeWidth="1.5" style={vis(4)} />
          {commits.map((c) => (
            <g key={c.id} style={vis(c.at)}>
              <circle cx={c.x} cy={c.y} r="8" fill="#0a1a2a" stroke={c.main ? "#3fd8b6" : "#ffb454"} strokeWidth="2" />
              <text x={c.x} y={c.y + 3.2} textAnchor="middle" fontSize="8" fill={c.main ? "#3fd8b6" : "#ffb454"} fontFamily="JetBrains Mono" fontWeight="700">{c.id}</text>
            </g>
          ))}
          <g style={vis(1)}><text x={232} y={20} fontSize="7" fill="#3fd8b6" fontFamily="JetBrains Mono">main</text></g>
          <g style={vis(2)}><text x={182} y={76} fontSize="7" fill="#ffb454" fontFamily="JetBrains Mono">feature</text></g>
          <g style={vis(6)}>
            <text x={130} y={14} textAnchor="middle" fontSize="8" fill="#ffb454" fontFamily="JetBrains Mono">merge ✓</text>
          </g>
        </svg>
      </div>
      <p className="text-center font-code text-[11px] text-dim mt-2" dir="ltr">
        {["checkout -b feature", "commit C", "commit D", "checkout main", "merge feature", "done ✓"][Math.min(step, 5)]}
      </p>
      <div className="flex justify-center mt-3">
        <VBtn onClick={() => setStep(0)}>پخش دوباره</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۲) چرخه HTTP ---------- */
const HTTP_STEPS = [
  { at: 0, text: "۱) مرورگر آدرس را می‌بیند؛ اول کش، بعد پرس‌وجوی DNS" },
  { at: 1, text: "۲) سرور DNS آدرس IP را برمی‌گرداند (مثلاً 185.143.233.4)" },
  { at: 2, text: "۳) اتصال TCP ساخته می‌شود (سه‌مرحله‌ای) و درخواست HTTP فرستاده می‌شود" },
  { at: 3, text: "۴) سرور کوئری دیتابیس را اجرا و پاسخ را آماده می‌کند" },
  { at: 2, text: "۵) پاسخ (Status 200 + JSON) برمی‌گردد" },
  { at: 0, text: "۶) مرورگر رندر می‌کند — و این چرخه برای هر منبع تکرار می‌شود" },
];
function HttpCycle() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = usePrefersReducedMotion();
  useTicker(playing && !reduced, 1500, () => setI((x) => (x + 1) % HTTP_STEPS.length));
  const pos = [2, 35, 66, 97][HTTP_STEPS[i].at];
  const labels = ["مرورگر", "DNS", "سرور", "دیتابیس"];
  return (
    <Frame title="سفر یک درخواست — از کلیک تا پیکسل" hint="هر بار که URL را می‌زنی این زنجیره اجرا می‌شود؛ کش و CDN یعنی کوتاه‌کردن همین مسیر.">
      <div className="relative pt-8 pb-2" dir="ltr">
        <div className="absolute top-[46px] right-[2%] left-[2%] h-px bg-linec" />
        <div
          className="absolute top-[38px] w-4 h-4 rounded-full bg-amber shadow-[0_0_18px_rgba(255,180,84,0.8)] transition-all duration-700 ease-in-out"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        />
        <div className="flex justify-between relative">
          {labels.map((l, idx) => (
            <div key={l} className={`flex flex-col items-center gap-2 transition-colors duration-500 ${HTTP_STEPS[i].at === idx ? "text-amber" : "text-faint"}`}>
              <span className={`w-10 h-10 grid place-items-center rounded-md border-2 transition-all duration-500 ${HTTP_STEPS[i].at === idx ? "border-amber bg-amber/10 scale-110" : "border-linec bg-night-800"}`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {idx === 0 && <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M3 8h18M8 21h8" /></>}
                  {idx === 1 && <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c4 4.5 4 12.5 0 17-4-4.5-4-12.5 0-17Z" /></>}
                  {idx === 2 && <><rect x="3.5" y="4" width="17" height="6.5" rx="1.5" /><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5" /><circle cx="7.3" cy="7.2" r="0.7" fill="currentColor" /><circle cx="7.3" cy="16.8" r="0.7" fill="currentColor" /></>}
                  {idx === 3 && <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>}
                </svg>
              </span>
              <span className="text-[11px] font-bold">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <p key={i} className="pop-in text-center text-[13px] text-dim border border-linec bg-night-900/70 rounded-md px-4 py-3 mt-4 min-h-[46px]">
        {HTTP_STEPS[i].text}
      </p>
      <div className="flex justify-center mt-3">
        <VBtn onClick={() => setPlaying((p) => !p)} active={playing}>{playing ? "توقف" : "پخش"}</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۳) لایه‌های شبکه ---------- */
const NET_LAYERS = [
  { name: "کاربرد", proto: "HTTP", color: "#ffb454" },
  { name: "انتقال", proto: "TCP", color: "#3fd8b6" },
  { name: "شبکه", proto: "IP", color: "#5ec8ea" },
  { name: "پیوند داده", proto: "Ethernet", color: "#e8b4ff" },
];
function Layers() {
  const [step, setStep] = useState(0);
  // 0..4 encapsulate, 5..8 decapsulate
  const headers = step <= 4 ? step : Math.max(0, 8 - step);
  const activeLayer = step <= 4 ? step - 1 : 8 - step;
  const packet = ["داده"].concat(NET_LAYERS.slice(0, headers).map((l) => l.proto)).reverse();
  return (
    <Frame title="بسته‌بندی داده در لایه‌ها — Encapsulation" hint="فرستنده پایین می‌رود و در هر لایه یک سربرگ می‌چسباند؛ گیرنده بالا می‌آید و یکی‌یکی باز می‌کند. مثل پاکت‌های تودرتو.">
      <div className="grid sm:grid-cols-2 gap-6 items-center">
        <div className="space-y-1.5">
          {NET_LAYERS.map((l, idx) => (
            <div key={l.name} className={`flex items-center justify-between rounded-md border-2 px-4 py-2.5 transition-all duration-400 ${activeLayer === idx ? "scale-[1.03]" : ""}`} style={{ borderColor: activeLayer === idx ? l.color : "rgba(124,178,232,0.14)", background: activeLayer === idx ? `${l.color}14` : "rgba(10,26,42,0.6)" }}>
              <span className="text-[13px] font-bold" style={{ color: activeLayer === idx ? l.color : "#9db4c9" }}>لایه {l.name}</span>
              <span className="font-code text-[10px] px-2 py-0.5 rounded" style={{ color: l.color, background: `${l.color}1a` }}>{headers > idx ? `${l.proto} ✓` : l.proto}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="font-code text-[10px] text-faint mb-2" dir="ltr">PACKET</p>
          <div key={step} className="pop-in inline-flex flex-wrap justify-center gap-1 rounded-md border border-linec bg-night-900 p-3 max-w-[240px]" dir="ltr">
            {packet.map((p) => {
              const layer = NET_LAYERS.find((l) => l.proto === p);
              return (
                <span key={p} className="font-code text-[10px] rounded px-2 py-1" style={layer ? { color: layer.color, background: `${layer.color}18`, border: `1px solid ${layer.color}55` } : { color: "#e9f1fa", background: "#16324c" }}>
                  {p === "داده" ? "DATA" : p}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-faint mt-2">{step <= 4 ? "در حال فرستادن ↓" : "در حال دریافت ↑"}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        <VBtn onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>قبلی</VBtn>
        <VBtn onClick={() => setStep((s) => (s + 1) % 9)} active>
          {step < 4 ? "بسته‌بندی ↓" : step < 8 ? "بازکردن ↑" : "شروع دوباره"}
        </VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۴) حافظه Stack/Heap ---------- */
function StackHeap() {
  const [allocs, setAllocs] = useState<{ id: number; name: string; gc: boolean }[]>([]);
  const next = useRef(1);
  const allocate = () => {
    if (allocs.length >= 3) return;
    setAllocs((a) => [...a, { id: next.current, name: `User#${next.current}`, gc: false }]);
    next.current += 1;
  };
  const deref = () => {
    setAllocs((a) => {
      const last = a[a.length - 1];
      if (!last) return a;
      return [...a.slice(0, -1), { ...last, gc: true }];
    });
    window.setTimeout(() => setAllocs((a) => a.slice(0, -1)), 700);
  };
  return (
    <Frame title="Stack در برابر Heap — خانه متغیر و خانه شی" hint="متغیر مرجع در Stack زندگی می‌کند و فقط یک «اشاره» به Heap دارد. وقتی اشاره‌گر حذف شود، GC شی را پس می‌گیرد.">
      <div className="grid grid-cols-2 gap-6 max-w-[460px] mx-auto" dir="ltr">
        <div>
          <p className="font-code text-[11px] text-cyan text-center mb-2">STACK (main)</p>
          <div className="border-2 border-linec rounded-md p-2 space-y-1.5 min-h-[140px] flex flex-col-reverse bg-night-900/60">
            {allocs.map((a) => (
              <div key={a.id} className={`pop-in font-code text-[11px] rounded px-3 py-2 border flex items-center justify-between transition-opacity duration-700 ${a.gc ? "opacity-0" : ""} border-cyan/40 bg-cyan/10 text-cyan`}>
                {a.name.toLowerCase().replace("#", "")}
                <span className="text-faint">→ ref</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-code text-[11px] text-amber text-center mb-2">HEAP</p>
          <div className="border-2 border-linec rounded-md p-2 space-y-1.5 min-h-[140px] flex flex-col-reverse bg-night-900/60">
            {allocs.map((a) => (
              <div key={a.id} className={`pop-in font-code text-[11px] rounded px-3 py-2 border border-amber/40 bg-amber/10 text-amber transition-all duration-700 ${a.gc ? "opacity-0 scale-75" : ""}`}>
                {'{'} name: "{a.name}" {'}'}
                {a.gc && <span className="text-coral text-[9px] block">GC'd ✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        <VBtn onClick={allocate} active disabled={allocs.length >= 3}>new User()</VBtn>
        <VBtn onClick={deref} disabled={allocs.length === 0 || allocs[allocs.length - 1].gc}>user = null</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۵) بن‌بست ---------- */
function Deadlock() {
  const [step, setStep] = useState(0);
  const reduced = usePrefersReducedMotion();
  useTicker(step < 4 && !reduced, 1100, () => setStep((s) => s + 1));
  const P = ({ name, on }: { name: string; on: boolean }) => (
    <div className={`w-24 py-4 text-center rounded-md border-2 font-code font-bold text-sm transition-all duration-500 ${on ? "border-amber bg-amber/10 text-amber" : "border-linec bg-night-800 text-dim"}`}>{name}</div>
  );
  const R = ({ name, by, waiting }: { name: string; by: string; waiting: boolean }) => (
    <div className={`w-24 py-4 text-center rounded-md border-2 font-code font-bold text-sm transition-all duration-500 ${waiting ? "border-coral bg-coral/10 text-coral animate-pulse" : by ? "border-teal bg-teal/10 text-teal" : "border-linec bg-night-800 text-dim"}`}>
      {name}
      {by && <span className="block text-[8px] font-normal mt-0.5">{waiting ? "منتظر!" : `توسط ${by}`}</span>}
    </div>
  );
  const msgs = [
    "دو پردازش، دو منبع — همه آزاد",
    "P1 منبع R1 را گرفت 🔒",
    "P2 منبع R2 را گرفت 🔒",
    "حالا هر دو منتظر منبعِ دیگری‌اند…",
    "بن‌بست! هیچ‌کس رها نمی‌کند 💀",
  ];
  return (
    <Frame title="بن‌بست (Deadlock) — انتظار دایره‌ای" hint="چهار شرط لازم: انحصار، نگه‌داشتن و انتظار، بدون پیش‌گیری، بدون پس‌گرفتن. حذف هر شرط، بن‌بست را غیرممکن می‌کند.">
      <div className="grid grid-cols-2 gap-x-16 gap-y-3 max-w-[300px] mx-auto py-4">
        <P name="P1" on={step >= 1} />
        <R name="R1" by={step >= 1 ? "P1" : ""} waiting={step >= 4} />
        <R name="R2" by={step >= 2 ? "P2" : ""} waiting={step >= 3} />
        <P name="P2" on={step >= 2} />
      </div>
      {step >= 3 && (
        <div className="flex items-center justify-center gap-2 font-code text-[10px] text-coral" dir="ltr">
          <span>P1 ⇄ R2</span>
          <span className="w-8 h-px bg-coral" />
          <span>P2 ⇄ R1</span>
          <span className="w-8 h-px bg-coral" />
          <span>circular wait</span>
        </div>
      )}
      <p key={step} className={`pop-in text-center text-[13px] font-bold mt-4 ${step >= 4 ? "text-coral" : "text-dim"}`}>{msgs[step]}</p>
      <div className="flex justify-center mt-3">
        <VBtn onClick={() => setStep(0)}>پخش دوباره</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۶) خط لوله SDLC ---------- */
const SDLC = ["نیازمندی‌ها", "طراحی", "پیاده‌سازی", "تست", "استقرار", "نگهداری"];
function Sdlc() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  useTicker(!reduced, 1500, () => setActive((a) => (a + 1) % SDLC.length));
  return (
    <Frame title="چرخه حیات نرم‌افزار — یک دور کامل" hint="این چرخه بی‌پایان است؛ در مدل‌های چابک هر اسپرینت یک دورِ کوچک و سریع از همین حلقه است.">
      <div className="flex items-center justify-between gap-1 flex-wrap">
        {SDLC.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-2">
              <span className={`w-11 h-11 grid place-items-center rounded-full border-2 font-display text-lg transition-all duration-500 ${i === active ? "border-amber bg-amber text-night-900 scale-110 shadow-[0_0_22px_rgba(255,180,84,0.4)]" : i < active ? "border-teal/60 text-teal bg-teal/10" : "border-linec text-faint bg-night-800"}`}>
                {i < active ? "✓" : fa(i + 1)}
              </span>
              <span className={`text-[10.5px] font-bold transition-colors duration-500 ${i === active ? "text-amber" : "text-faint"}`}>{s}</span>
            </div>
            {i < SDLC.length - 1 && <span className={`h-0.5 w-4 sm:w-7 mb-6 rounded-full transition-colors duration-500 ${i < active ? "bg-teal/60" : "bg-linec"}`} />}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- ۱۷) تک‌سازه در برابر میکروسرویس ---------- */
function Microvmono() {
  const [mode, setMode] = useState<"mono" | "micro">("micro");
  const [tick, setTick] = useState(0);
  const reduced = usePrefersReducedMotion();
  useTicker(mode === "micro" && !reduced, 900, () => setTick((t) => t + 1));
  const services = ["کاربر", "سفارش", "پرداخت", "موجودی"];
  return (
    <Frame title="تک‌سازه در برابر میکروسرویس" hint="میکروسرویس رایگان نیست: شبکه، خطای جزئی و نسخه‌بندی قراردادها هزینه‌اش است. اول تک‌سازه‌ی ماژولار، بعد تصمیم.">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className={`rounded-md border-2 p-4 transition-all duration-500 ${mode === "mono" ? "border-amber" : "border-linec opacity-45"}`}>
          <p className="font-code text-[10px] text-faint text-center mb-3" dir="ltr">MONOLITH</p>
          <div className="border-2 border-linec rounded-md bg-night-800 p-3 grid grid-cols-2 gap-1.5">
            {services.map((s) => (
              <div key={s} className="text-center text-[11px] font-bold text-dim border border-linec rounded py-3 bg-night-900/70">{s}</div>
            ))}
          </div>
          <p className="text-center text-[10.5px] text-faint mt-2.5">یک Deploy · یک دیتابیس · یک خطا = همه‌چیز پایین</p>
        </div>
        <div className={`rounded-md border-2 p-4 transition-all duration-500 ${mode === "micro" ? "border-teal" : "border-linec opacity-45"}`}>
          <p className="font-code text-[10px] text-faint text-center mb-3" dir="ltr">MICROSERVICES</p>
          <div className="text-center mb-2">
            <span className={`inline-block font-code text-[10px] rounded px-3 py-1.5 border transition-colors duration-300 ${mode === "micro" ? "border-amber text-amber bg-amber/10" : "border-linec text-faint"}`}>API Gateway</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {services.map((s, i) => (
              <div key={s} className={`text-center text-[11px] font-bold rounded py-3 border transition-all duration-300 ${mode === "micro" && tick % 4 === i ? "border-teal text-teal bg-teal/10 scale-105" : "border-linec text-dim bg-night-800"}`}>{s}</div>
            ))}
          </div>
          <p className="text-center text-[10.5px] text-faint mt-2.5">Deploy مستقل · مقیاس مستقل · خرابیِ ایزوله</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-5">
        <VBtn onClick={() => setMode("mono")} active={mode === "mono"}>تک‌سازه</VBtn>
        <VBtn onClick={() => setMode("micro")} active={mode === "micro"}>میکروسرویس</VBtn>
      </div>
    </Frame>
  );
}

/* ---------- ۱۸) لایه‌های داکر ---------- */
function DockerLayers() {
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const run = () => { setRunning(true); setCount((c) => Math.min(c + 1, 3)); };
  const layer = (t: string, c: string) => (
    <div className="text-center font-code text-[10.5px] rounded border px-3 py-2 transition-colors" style={{ borderColor: `${c}55`, color: c, background: `${c}10` }}>{t}</div>
  );
  return (
    <Frame title="کانتینر در برابر ماشین مجازی" hint="کانتینر Hypervisor و سیستم‌عامل مهمان را حذف می‌کند؛ همه کانتینرها یک کرنل را شریک‌اند — برای همین ثانیه‌ای بالا می‌آیند.">
      <div className="grid sm:grid-cols-2 gap-6 max-w-[560px] mx-auto" dir="ltr">
        <div className="space-y-1.5">
          <p className="font-code text-[10px] text-faint text-center mb-2">VM (سنگین)</p>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1.5">{layer("Guest OS", "#ff7a63")}{layer("App A", "#9db4c9")}</div>
            <div className="space-y-1.5">{layer("Guest OS", "#ff7a63")}{layer("App B", "#9db4c9")}</div>
          </div>
          {layer("Hypervisor", "#e8b4ff")}
          {layer("Host OS + Hardware", "#64809c")}
        </div>
        <div className="space-y-1.5">
          <p className="font-code text-[10px] text-faint text-center mb-2">Container (سبک)</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].slice(0, count).map((i) => (
              <div key={i} className="pop-in space-y-1.5">
                {layer(`App ${["A", "B", "C"][i]}`, "#9db4c9")}
                {layer("Deps", "#3fd8b6")}
              </div>
            ))}
            {count === 0 && <div className="col-span-3 border-2 border-dashed border-linec rounded text-center py-5 text-[10px] text-faint font-code">docker run …</div>}
          </div>
          {layer("Docker Engine", "#ffb454")}
          {layer("Host OS (shared kernel) + Hardware", "#64809c")}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <VBtn onClick={run} active disabled={count >= 3}>docker run app</VBtn>
        {running && <span className="pop-in font-code text-[11px] text-teal">✓ started in 0.{fa(3 + count)}s</span>}
        {count >= 3 && <VBtn onClick={() => { setCount(0); setRunning(false); }}>docker rm -f</VBtn>}
      </div>
    </Frame>
  );
}

/* ---------- دست‌دادن سه‌راهی TCP ---------- */
function TcpHandshake() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  // مراحل: 0=آماده، 1=SYN، 2=SYN-ACK، 3=ACK(اتصال)، 4=DATA، 5=ACK داده، 6=FIN/بسته
  const STEPS = [
    { label: "آماده", note: "هنوز اتصالی نیست؛ کلاینت می‌خواهد گفتگو را شروع کند." },
    { label: "SYN →", note: "کلاینت SYN می‌فرستد: «می‌خواهم وصل شوم؛ شماره ترتیب من 1000»." },
    { label: "← SYN-ACK", note: "سرور قبول می‌کند: «شماره من 5000، و 1001 تو را تأیید می‌کنم»." },
    { label: "ACK → (اتصال برقرار)", note: "کلاینت تأیید می‌کند: «5001 گرفتم». حالا دو طرف شماره‌ها را می‌دانند." },
    { label: "DATA → (200 بایت)", note: "داده با شماره ترتیب 1001 می‌رود؛ یعنی بایت‌های 1001 تا 1200." },
    { label: "← ACK=1201", note: "سرور می‌گوید «تا 1200 گرفتم؛ بعدی را از 1201 بفرست». اگر نرسد، بازفرستادن." },
    { label: "FIN ⇄ (پایان)", note: "هر دو طرف با FIN مهربانانه اتصال را می‌بندند و تأیید می‌کنند." },
  ];
  const play = () => {
    if (reduced) {
      setStep((s) => (s + 1) % STEPS.length);
      return;
    }
    setStep(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length - 1) window.clearInterval(id);
    }, 950);
  };

  // کدام بسته الان «در حال حرکت» است
  const moving = !reduced && step > 0 && step < STEPS.length - 1;
  const dir = step === 2 || step === 5 ? "left" : "right";

  return (
    <div className="border border-linec bg-night-900/80 rounded-md p-5 select-none" dir="ltr">
      <div className="flex items-center justify-between mb-3">
        <span className="font-code text-xs text-cyan border border-cyan/30 bg-cyan/5 rounded px-2 py-1">TCP · three-way handshake</span>
        <button onClick={play} className="text-xs font-bold bg-amber text-night-900 rounded-md px-4 py-1.5 hover:bg-[#ffc775] transition-colors cursor-pointer">
          {step === 0 ? "شروع اتصال" : "پخش دوباره"}
        </button>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch min-h-[190px]">
        {/* ستون کلاینت */}
        <div className="border border-linec rounded-md bg-night-800/60 p-3 flex flex-col">
          <p className="font-bold text-sm text-teal">Client</p>
          <p className="font-code text-[10px] text-faint mt-1">seq=1000</p>
          <div className="mt-auto space-y-1">
            {step >= 1 && <p className="pop-in font-code text-[10px] text-dim">→ SYN seq=1000</p>}
            {step >= 3 && <p className="pop-in font-code text-[10px] text-dim">→ ACK (اتصال ✓)</p>}
            {step >= 4 && <p className="pop-in font-code text-[10px] text-dim">→ DATA seq=1001</p>}
            {step >= 6 && <p className="pop-in font-code text-[10px] text-dim">→ FIN (بستن)</p>}
          </div>
        </div>

        {/* ناحیه میانی — بسته‌های در حال حرکت */}
        <div className="relative w-24 border-x border-dashed border-linec/60 flex items-center justify-center">
          {moving && (
            <span
              className={`pop-in font-code text-[10px] font-bold px-2 py-1 rounded border whitespace-nowrap ${
                dir === "right" ? "bg-teal/15 text-teal border-teal/50" : "bg-amber/15 text-amber border-amber/50"
              }`}
            >
              {STEPS[step].label.replace(/[→←⇄() ]/g, "")}
            </span>
          )}
          {!moving && step === 3 && (
            <span className="pop-in font-code text-[10px] text-teal border border-teal/40 bg-teal/10 rounded px-2 py-1">ESTABLISHED</span>
          )}
          {!moving && step === 6 && (
            <span className="pop-in font-code text-[10px] text-coral border border-coral/40 bg-coral/10 rounded px-2 py-1">CLOSED</span>
          )}
        </div>

        {/* ستون سرور */}
        <div className="border border-linec rounded-md bg-night-800/60 p-3 flex flex-col">
          <p className="font-bold text-sm text-amber">Server</p>
          <p className="font-code text-[10px] text-faint mt-1">seq=5000</p>
          <div className="mt-auto space-y-1 text-right">
            {step >= 2 && <p className="pop-in font-code text-[10px] text-dim">SYN-ACK seq=5000 ←</p>}
            {step >= 5 && <p className="pop-in font-code text-[10px] text-dim">ACK=1201 ←</p>}
            {step >= 6 && <p className="pop-in font-code text-[10px] text-dim">ACK/FIN ←</p>}
          </div>
        </div>
      </div>

      <p key={step} className="pop-in mt-4 border border-linec bg-night-800/60 rounded-md p-3.5 text-[12.5px] leading-6 text-dim">
        <b className="text-amber">{fa(step)}. {STEPS[step].label}:</b> {STEPS[step].note}
      </p>

      <div className="flex gap-1.5 mt-3" dir="rtl">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} aria-label={`مرحله ${fa(i)}`} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === step ? "w-6 bg-amber" : "w-2.5 bg-night-600 hover:bg-faint"}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- محاسبه‌گر زیرشبکه ---------- */
function SubnetCalc() {
  const [cidr, setCidr] = useState(24);
  const [ip, setIp] = useState("192.168.1.50");

  const calc = useMemo(() => {
    const parts = ip.split(".").map((x) => parseInt(x, 10));
    const valid = parts.length === 4 && parts.every((n) => !Number.isNaN(n) && n >= 0 && n <= 255);
    if (!valid) return null;
    const ipNum = ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const hostBits = 32 - cidr;
    const hosts = hostBits >= 2 ? Math.pow(2, hostBits) - 2 : 0;
    const broadcast = (network + Math.pow(2, hostBits) - 1) >>> 0;
    const toStr = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    const maskStr = [24, 16, 8, 0].map((s) => (mask >>> s) & 255).join(".");
    return {
      mask: maskStr,
      network: toStr(network),
      broadcast: toStr(broadcast),
      first: toStr((network + 1) >>> 0),
      last: toStr((broadcast - 1) >>> 0),
      hosts,
      hostBits,
    };
  }, [ip, cidr]);

  return (
    <div className="border border-linec bg-night-900/80 rounded-md p-5 select-none">
      <div className="flex flex-wrap items-center gap-3 mb-5" dir="rtl">
        <span className="font-code text-xs text-cyan border border-cyan/30 bg-cyan/5 rounded px-2 py-1" dir="ltr">Subnet Calculator</span>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          dir="ltr"
          placeholder="192.168.1.50"
          className="font-code text-sm bg-night-950 border border-linec rounded-md px-3 py-1.5 w-36 text-left text-mist outline-none focus:border-amber/60"
        />
        <span className="font-code text-lg text-amber">/</span>
        <input
          type="range"
          min={8}
          max={30}
          value={cidr}
          onChange={(e) => setCidr(parseInt(e.target.value, 10))}
          className="w-40 accent-amber"
          aria-label="CIDR"
        />
        <span className="font-code text-sm font-bold text-amber w-9" dir="ltr">/{cidr}</span>
      </div>

      {!calc ? (
        <p className="text-sm text-coral border border-coral/40 bg-coral/5 rounded-md p-4">آدرس IP معتبر نیست — چهار عدد بین ۰ تا ۲۵۵ با نقطه جدا کن.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3" dir="rtl">
          {[
            ["آدرس شبکه (Network)", calc.network, "text-teal"],
            ["Broadcast", calc.broadcast, "text-coral"],
            ["اولین میزبان قابل‌استفاده", calc.first, "text-mist"],
            ["آخرین میزبان قابل‌استفاده", calc.last, "text-mist"],
            ["Subnet Mask", calc.mask, "text-cyan"],
            ["تعداد میزبان قابل‌استفاده", `${fa(calc.hosts)} (${fa(2)}^${fa(calc.hostBits)} − ${fa(2)})`, "text-amber"],
          ].map(([label, val, color]) => (
            <div key={label as string} className="border border-linec bg-night-800/60 rounded-md p-3.5">
              <p className="text-[11px] text-faint">{label}</p>
              <p className={`font-code text-[15px] font-bold mt-1 ${color}`} dir="ltr">{val}</p>
            </div>
          ))}
          <div className="sm:col-span-2 border border-linec bg-night-800/40 rounded-md p-3.5 text-[12px] leading-6 text-dim">
            با <b className="text-amber" dir="ltr">/{cidr}</b>، <b className="text-amber">{fa(cidr)}</b> بیت اول شبکه و <b className="text-amber">{fa(calc.hostBits)}</b> بیت میزبان است؛ پس {fa(Math.pow(2, calc.hostBits))} آدرس داریم که ۲ تای آن (شبکه و broadcast) رزرو می‌شود.
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- ماشین‌حساب chmod ---------- */
function ChmodCalc() {
  // بیت‌ها: [u.r,u.w,u.x, g.r,g.w,g.x, o.r,o.w,o.x]
  const [bits, setBits] = useState<boolean[]>([true, true, true, true, false, true, true, false, false]); // 755
  const groups = [
    { t: "مالک (u)", cls: "text-amber" },
    { t: "گروه (g)", cls: "text-teal" },
    { t: "بقیه (o)", cls: "text-cyan" },
  ];
  const perms = [
    { t: "خواندن (r)", v: 4 },
    { t: "نوشتن (w)", v: 2 },
    { t: "اجرا (x)", v: 1 },
  ];

  const octal = [0, 1, 2].map((g) => bits.slice(g * 3, g * 3 + 3).reduce((s, b, i) => s + (b ? perms[i].v : 0), 0)).join("");
  const symbolic = bits.map((b, i) => (b ? "rwx"[i % 3] : "-")).join("");
  const isDangerous = octal === "777";

  const presets: { o: string; note: string }[] = [
    { o: "755", note: "دایرکتوری و اسکریپت" },
    { o: "644", note: "فایل معمولی" },
    { o: "600", note: "کلید SSH و اسرار" },
    { o: "777", note: "خطرناک — تقریباً هرگز!" },
  ];

  const setPreset = (o: string) => {
    const digits = o.split("").map(Number);
    setBits(digits.flatMap((d) => [d & 4 ? true : false, d & 2 ? true : false, d & 1 ? true : false]));
  };

  return (
    <Frame title="ماشین‌حساب chmod — مجوزها را کلیک کن" hint="هر خانه یک بیت است: r=۴ ، w=۲ ، x=۱ و مجموع هر ستون، رقم هشتایی آن دسته. این همان منطق 755 و 644 است.">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {groups.map((g, gi) => {
          const digit = bits.slice(gi * 3, gi * 3 + 3).reduce((s, b, i) => s + (b ? perms[i].v : 0), 0);
          return (
            <div key={g.t} className="border border-linec rounded-md p-3 bg-night-900/60">
              <p className={`text-[12px] font-bold text-center ${g.cls}`}>{g.t}</p>
              <p className={`text-center font-code text-2xl font-bold my-1.5 ${g.cls}`}>{fa(digit)}</p>
              <div className="space-y-1.5">
                {perms.map((p, pi) => {
                  const on = bits[gi * 3 + pi];
                  return (
                    <button
                      key={p.t}
                      onClick={() => setBits((prev) => prev.map((b, i) => (i === gi * 3 + pi ? !b : b)))}
                      className={`w-full flex items-center justify-between rounded border px-2.5 py-1.5 text-[11.5px] transition-all duration-200 cursor-pointer ${
                        on ? `${g.cls} border-current bg-night-800` : "text-faint border-linec hover:border-mist/30"
                      }`}
                    >
                      <span>{p.t}</span>
                      <span className="font-code font-bold">{on ? "rwx"[pi] : "−"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border border-linec rounded-md bg-night-950 p-4 font-code text-center" dir="ltr">
        <p className="text-[11px] text-faint mb-1.5">$ ls -l file</p>
        <p className="text-lg text-mist tracking-[0.2em]">-{symbolic}</p>
        <p className={`text-2xl font-bold mt-2 ${isDangerous ? "text-coral" : "text-amber"}`}>
          chmod {octal} file
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {presets.map((p) => (
          <VBtn key={p.o} onClick={() => setPreset(p.o)} active={octal === p.o}>
            {p.o} <span className="hidden sm:inline opacity-75">— {p.note}</span>
          </VBtn>
        ))}
      </div>
      {isDangerous && (
        <p className="pop-in text-center text-[12px] text-coral mt-3 font-semibold">
          ⚠ هر کاربری می‌تواند این فایل را بخواند، بنویسد و اجرا کند — درِ باز برای همه یعنی درِ باز برای مهاجم.
        </p>
      )}
    </Frame>
  );
}

/* ---------- درخت فایل‌سیستم FHS ---------- */
const FHS_DIRS: { d: string; t: string; p: string; ex: string }[] = [
  { d: "/etc", t: "تنظیمات سیستمی", p: "خانه پیکربندی همه سرویس‌ها؛ هر فایلی که سیستم «چطور» رفتار کند اینجاست. ویرایش این فایل‌ها + ری‌استارت سرویس = تغییر رفتار سیستم.", ex: "sudoedit /etc/ssh/sshd_config" },
  { d: "/home", t: "خانه کاربران", p: "هر کاربر یک دایرکتوری دارد (~/) و فایل‌های شخصی، دانلودها و تنظیمات نقطه‌دارش (.bashrc) اینجاست. کاربران عادی فقط به خانه خودشان حق نوشتن دارند.", ex: "cd ~ && ls -la" },
  { d: "/var", t: "داده‌های متغیر", p: "لاگ‌ها، صف‌ها، کش‌ها و دیتابیس‌ها — هر چیزی که حین کار بزرگ و کوچک می‌شود. اولین مقصد وقتی دیسک پر شده یا دنبال لاگی.", ex: "du -h --max-depth=1 /var | sort -rh" },
  { d: "/tmp", t: "فایل‌های موقت", p: "فضای اشتراکی موقت که ممکن است هر لحظه (و حتماً موقع ری‌استارت) پاک شود. هیچ چیز مهمی اینجا نگذار — فقط چیزهایی که از دست‌رفتنشان مهم نیست.", ex: "systemd-tmpfiles --clean" },
  { d: "/bin و /sbin", t: "فرمان‌های پایه", p: "فرمان‌های ضروری سیستم (ls، cp، mount) — sbin نسخه‌های مدیریتی‌اند (reboot، fdisk). در اوبونتوی مدرن معمولاً لینک به /usr/bin هستند.", ex: "ls /usr/bin | wc -l" },
  { d: "/usr", t: "نرم‌افزارهای نصبی", p: "دنیای برنامه‌های نصب‌شده با apt: باینری‌ها در usr/bin، کتابخانه‌ها در usr/lib و مستندات در usr/share. بزرگ‌ترین ساکن دیسک‌های توسعه‌دهنده‌ها.", ex: "which python3" },
  { d: "/dev", t: "دستگاه‌ها", p: "هر سخت‌افزار به‌شکل فایل: دیسک‌ها sda و nvme0n1، پارتیشن‌ها sda1… و دو فایل جالب: /dev/null (سیاه‌چاله) و /dev/random (تصادف).", ex: "lsblk" },
  { d: "/proc", t: "پنجره زنده به هسته", p: "فایل‌سیستم مجازی: اطلاعات لحظه‌ای پردازنده‌ها، حافظه و processها. خواندنش یعنی پرسیدن مستقیم از هسته — بدون هیچ ابزاری.", ex: "cat /proc/meminfo | head -3" },
  { d: "/sys", t: "کنترل هسته", p: "مثل proc ولی برای «تنظیم»: پارامترهای سخت‌افزار و هسته. نوشتن ۱ در یک فایلش می‌تواند قابلیتی را روشن کند — قدرت و خطر همزمان.", ex: "cat /sys/class/net/*/address" },
  { d: "/boot", t: "فایل‌های بوت", p: "هسته‌های لینوکس (vmlinuz) و initramfs که سیستم برای بالاآمدن لازم دارد. دست‌نزدن به اینجا بدون دلیل = ریسک بوت‌نشدن.", ex: "ls /boot" },
  { d: "/opt", t: "نرم‌افزارهای جانبی", p: "برای بسته‌های بزرگ و خودکفا که خارج از apt نصب می‌شوند (مثل ابزارهای تجاری). هر برنامه زیردایرکتوری خودش.", ex: "ls /opt" },
  { d: "/root", t: "خانه کاربر root", p: "عمداً از /home جداست تا در مشکلات فایل‌سیستم /home، مدیر هنوز خانه داشته باشد. جایی که نباید وقت بگذرانی!", ex: "sudo ls /root" },
];

function FhsTree() {
  const [sel, setSel] = useState(0);
  const cur = FHS_DIRS[sel];
  return (
    <Frame title="سلسله‌مراتب فایل‌سیستم — روی هر دایرکتوری کلیک کن" hint="این نقشه شهرِ لینوکس است؛ در هر توزیعی (اوبونتو، دبیان، ردحت) تقریباً یکسان است.">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-linec rounded-md bg-night-900/60 p-2 font-code text-[13px] max-h-72 overflow-y-auto" dir="ltr">
          <p className="px-2.5 py-1.5 text-faint">user@ubuntu:~$ ls /</p>
          {FHS_DIRS.map((f, i) => (
            <button
              key={f.d}
              onClick={() => setSel(i)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                i === sel ? "bg-amber/15 text-amber" : "text-dim hover:bg-night-800 hover:text-mist"
              }`}
            >
              <span className="text-teal shrink-0">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" /></svg>
              </span>
              {f.d.startsWith("/") ? f.d.slice(1) : f.d}
            </button>
          ))}
        </div>
        <div key={sel} className="pop-in border border-linec rounded-md bg-night-950 p-5">
          <p className="font-code text-amber text-xl font-bold" dir="ltr">{cur.d}</p>
          <p className="font-display text-lg text-mist mt-1">{cur.t}</p>
          <p className="text-dim text-[13px] leading-7 mt-3">{cur.p}</p>
          <p className="font-code text-[12px] text-teal bg-teal/5 border border-teal/25 rounded px-3 py-2 mt-4" dir="ltr">
            $ {cur.ex}
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- انتخاب رهبر Raft ---------- */
function RaftElection() {
  const [phase, setPhase] = useState(0);
  const [term, setTerm] = useState(4);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (phase === 0 || phase >= 4) return;
    const id = window.setTimeout(
      () => {
        if (phase === 1) setTerm((t) => t + 1);
        setPhase((p) => p + 1);
      },
      reduced ? 80 : phase === 3 ? 900 : 1150
    );
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  // ۵ گره روی بیضی؛ A بالا (رهبر اولیه)، C پایین (نامزد)
  const names = ["A", "B", "C", "D", "E"];
  const cx = 170, cy = 122, rx = 128, ry = 84;
  const pos = names.map((_, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });

  const role = (i: number): "leader" | "dead" | "candidate" | "voted" | "follower" => {
    if (i === 0) return phase === 0 ? "leader" : "dead";
    if (i === 2) return phase >= 4 ? "leader" : phase >= 2 ? "candidate" : "follower";
    if (i === 1 || i === 3) return phase >= 3 ? "voted" : "follower";
    return "follower";
  };

  const NODE_COLOR: Record<string, string> = {
    leader: "#ffb454",
    dead: "#3a4a5c",
    candidate: "#ff7a63",
    voted: "#3fd8b6",
    follower: "#64809c",
  };

  const captions: Record<number, string> = {
    0: `گره A رهبر است (Term ${fa(term)}) و هر ۵۰ میلی‌ثانیه Heartbeat می‌فرستد. همه نوشتن‌ها از او می‌گذرند.`,
    1: "گره A ناگهان مرد — بدون خداحافظی. پیروها فقط «سکوت» را می‌شنوند و منتظر می‌مانند تا مهلت‌شان تمام شود…",
    2: `مهلت گره C تمام شد (مهلت‌ها تصادفی‌اند): نامزد می‌شود، Term را به ${fa(term)} می‌برد و از همه رأی می‌خواهد (RequestVote).`,
    3: "گره‌های B و D رأی می‌دهند — هر گره در هر Term فقط یک رأی دارد. E دیر رسید. حالا C اکثریت (۲ از ۳ رأی‌دهنده) را دارد.",
    4: `گره C رهبر جدید است (Term ${fa(term)}) و دوباره Heartbeat می‌فرستد. وقفه کل: ~۲۰۰ میلی‌ثانیه — و هیچ داده‌ای گم نشد.`,
  };

  const reset = () => {
    setPhase(0);
    setTerm(4);
  };

  return (
    <div className="select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-2">
          <span className="text-xs font-code border border-amber/40 bg-amber/5 text-amber rounded px-2.5 py-1">Term {fa(term)}</span>
          {phase === 4 && (
            <span className="text-xs font-code border border-teal/40 bg-teal/5 text-teal rounded px-2.5 py-1">رهبر: C</span>
          )}
          {phase === 0 && (
            <span className="text-xs font-code border border-linec text-faint rounded px-2.5 py-1">رهبر: A</span>
          )}
        </span>
        <span className="flex gap-2">
          {phase === 0 && (
            <VBtn onClick={() => setPhase(1)} active>⚡ گره A را از کار بینداز</VBtn>
          )}
          {(phase === 4) && (
            <VBtn onClick={reset}>↺ شروع دوباره</VBtn>
          )}
        </span>
      </div>

      <svg viewBox="0 0 340 244" className="w-full max-w-md mx-auto">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--color-night-600)" strokeDasharray="3 6" />
        {/* خطوط رأی‌خواهی از C (اندیس ۲) */}
        {phase >= 2 && [1, 3, 4].map((t) => {
          const votedYes = (t === 1 || t === 3) && phase >= 3;
          return (
            <line
              key={t}
              x1={pos[2].x} y1={pos[2].y} x2={pos[t].x} y2={pos[t].y}
              stroke={votedYes ? "#3fd8b6" : "#ff7a63"}
              strokeWidth={votedYes ? 2.4 : 1.4}
              strokeDasharray={votedYes ? "none" : "5 5"}
              opacity={0.75}
              style={{ transition: "all .5s" }}
            />
          );
        })}
        {/* ضربان رهبر */}
        {(phase === 0 || phase === 4) && [1, 3, 4].map((t) => {
          const li = phase === 0 ? 0 : 2;
          return <line key={`hb${t}`} x1={pos[li].x} y1={pos[li].y} x2={pos[t].x} y2={pos[t].y} stroke="#ffb454" strokeWidth={1.2} opacity={0.3} />;
        })}
        {names.map((n, i) => {
          const r = role(i);
          const col = NODE_COLOR[r];
          return (
            <g key={n} style={{ transition: "opacity .4s" }} opacity={r === "dead" ? 0.45 : 1}>
              {r === "leader" && <circle cx={pos[i].x} cy={pos[i].y} r={26} fill="none" stroke={col} strokeWidth={1.5} className={reduced ? "" : "glow-pulse"} />}
              <circle cx={pos[i].x} cy={pos[i].y} r={20} fill="var(--color-night-800)" stroke={col} strokeWidth={r === "follower" ? 1.4 : 2.6} style={{ transition: "stroke .4s" }} />
              {r === "dead" ? (
                <path d={`M${pos[i].x - 7} ${pos[i].y - 7} L${pos[i].x + 7} ${pos[i].y + 7} M${pos[i].x + 7} ${pos[i].y - 7} L${pos[i].x - 7} ${pos[i].y + 7}`} stroke="#ff7a63" strokeWidth={2.4} strokeLinecap="round" />
              ) : (
                <text x={pos[i].x} y={pos[i].y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={col}>{n}</text>
              )}
              {r === "leader" && (
                <path d={`M${pos[i].x - 9} ${pos[i].y - 27} l4 5 l5 -6 l5 6 l4 -5 v8 h-18 Z`} fill="#ffb454" />
              )}
            </g>
          );
        })}
      </svg>

      <div key={phase} className="pop-in border border-linec bg-night-800/60 rounded-md p-4 min-h-[70px] mt-2">
        <p className="text-dim text-[13px] leading-7">{captions[phase]}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] text-faint">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffb454" }} /> رهبر</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff7a63" }} /> نامزد</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3fd8b6" }} /> رأی مثبت</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#64809c" }} /> پیرو</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3a4a5c" }} /> مرده</span>
      </div>
    </div>
  );
}

/* ---------- هش‌گذاری سازگار ---------- */
function ConsistentHash() {
  const ALL_NODES = ["Shard-A", "Shard-B", "Shard-C", "Shard-D", "Shard-E", "Shard-F"];
  const COLORS = ["#ffb454", "#3fd8b6", "#5ec8ea", "#ff7a63", "#c792ea", "#ffd166"];
  const [count, setCount] = useState(3);
  const [moved, setMoved] = useState<number | null>(null);
  const prevOwner = useRef<Map<string, number>>(new Map());

  const hashPos = (s: string) => {
    let h = 2166136261;
    for (const c of s) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 360;
  };

  const nodes = ALL_NODES.slice(0, count);
  const nodePos = nodes.map((n) => hashPos(n));
  const sorted = nodePos.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const keys = Array.from({ length: 12 }, (_, i) => `k${i + 1}`);

  const ownerOf = (kpos: number) => {
    const hit = sorted.find((n) => n.p >= kpos);
    return (hit ?? sorted[0]).i;
  };

  useEffect(() => {
    const next = new Map<string, number>();
    let mv = 0;
    keys.forEach((k) => {
      const o = ownerOf(hashPos(k));
      next.set(k, o);
      const before = prevOwner.current.get(k);
      if (before !== undefined && before !== o) mv += 1;
    });
    prevOwner.current = next;
    setMoved(prevOwner.current.size === keys.length && count === 3 ? null : mv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const C = 150, R = 108;
  const pt = (deg: number, r = R) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
  };

  return (
    <div className="select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs text-dim">
          {count === 3 && moved === null ? "هر کلید به اولین گره بعد از خودش (در جهت ساعت) تعلق دارد" : `با تغییر گره‌ها، فقط <b class="text-amber">${moved ?? 0}</b> کلید از ۱۲ جابه‌جا شد`}
        </span>
        <span className="flex gap-2">
          <VBtn onClick={() => setCount((c) => Math.max(2, c - 1))} disabled={count <= 2}>− گره</VBtn>
          <VBtn onClick={() => setCount((c) => Math.min(6, c + 1))} disabled={count >= 6} active>+ گره</VBtn>
        </span>
      </div>

      <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-night-600)" strokeWidth={1.5} />
        {[0, 90, 180, 270].map((d) => {
          const a = pt(d, R + 8), b = pt(d, R - 8);
          return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-night-600)" strokeWidth={1} />;
        })}
        {/* کلیدها: لوزی رنگی روی حلقه */}
        {keys.map((k) => {
          const p = pt(hashPos(k));
          const o = ownerOf(hashPos(k));
          return (
            <g key={k} style={{ transition: "all .6s" }}>
              <rect x={p.x - 4} y={p.y - 4} width={8} height={8} transform={`rotate(45 ${p.x} ${p.y})`} fill={COLORS[o]} opacity={0.9}>
                <title>{`${k} → ${nodes[o]}`}</title>
              </rect>
            </g>
          );
        })}
        {/* گره‌ها */}
        {nodes.map((n, i) => {
          const p = pt(nodePos[i]);
          return (
            <g key={n} style={{ transition: "all .6s" }}>
              <circle cx={p.x} cy={p.y} r={16} fill="var(--color-night-800)" stroke={COLORS[i]} strokeWidth={2.5} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS[i]}>{String.fromCharCode(65 + i)}</text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 text-[11px] text-faint">
        {nodes.map((n, i) => (
          <span key={n} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
            {n}
          </span>
        ))}
      </div>

      <p className="text-center text-[11.5px] text-faint mt-3 leading-6">
        با باقیمانده‌ساده (key % N) هر تغییر گره <b className="text-coral">همه ۱۲ کلید</b> را جابه‌جا می‌کرد؛ حلقه فقط همسایه‌های گره جدید را جابه‌جا می‌کند.
      </p>
    </div>
  );
}

/* ---------- مسیر رندر بحرانی ---------- */
function RenderPath() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = [
    { t: "بایت‌های HTML", d: "پاسخ سرور می‌رسد: متنی از تگ‌ها. هنوز هیچ «صفحه‌ای» وجود ندارد — فقط کاراکتر." },
    { t: "درخت DOM", d: "پارسر تگ‌ها را به گره تبدیل می‌کند و ساختار درختی صفحه شکل می‌گیرد — بدون هیچ ظاهری." },
    { t: "درخت CSSOM", d: "همزمان، استایل‌ها پارس می‌شوند: کدام گره چه رنگ، اندازه و چیدمانی دارد." },
    { t: "درخت رندر", d: "DOM + CSSOM ترکیب می‌شوند؛ عناصر نامرئی (display:none) از درخت حذف می‌شوند." },
    { t: "Layout", d: "جای دقیق و اندازه هر جعبه حساب می‌شود — مختصاتِ هر پیکسلِ محتوا." },
    { t: "Paint", d: "مرورگر پیکسل‌ها را می‌کشد: رنگ‌ها، متن، سایه‌ها — تصویر صفحه آماده می‌شود." },
    { t: "Composite", d: "لایه‌ها روی GPU ترکیب می‌شوند و فریم نهایی روی نمایشگر می‌نشیند. تمام!" },
  ];

  useTicker(playing && !reduced, 1700, () => setStep((s) => (s + 1) % steps.length));

  const boxCls = (extra = "") =>
    `border transition-all duration-500 ${
      step >= 5 ? "border-night-600" : step >= 1 ? "border-faint/70" : "border-transparent"
    } ${extra}`;
  const fill = (from: string, to = "") => (step >= 5 ? from : "bg-transparent") + (to ? " " + to : "");

  return (
    <Frame title="شبیه‌ساز: مسیر رندر بحرانی — از بایت تا پیکسل" hint="قدم‌به‌قدم جلو برو (یا پخش خودکار) و ببین مرورگر چطور کد را به تصویر تبدیل می‌کند — و عنصر display:none در مرحله ۴ از درخت حذف می‌شود.">
      <div className="grid md:grid-cols-2 gap-5">
        {/* صحنه مرورگر */}
        <div className="rounded-md border border-linec bg-night-900 overflow-hidden" dir="ltr">
          <div className="flex items-center gap-1.5 px-3 h-8 border-b border-linec bg-night-800/70">
            <span className="w-2 h-2 rounded-full bg-coral/70" />
            <span className="w-2 h-2 rounded-full bg-amber/70" />
            <span className="w-2 h-2 rounded-full bg-teal/70" />
            <span className="font-code text-[9px] text-faint ml-2">bitcode.academy</span>
            {step === 6 && (
              <span className="ml-auto font-code text-[9px] text-teal border border-teal/40 rounded px-1.5 py-0.5 pop-in">60fps ✓</span>
            )}
          </div>

          {step === 0 ? (
            <pre className="font-code text-[10px] leading-6 text-dim p-4 min-h-[240px] overflow-hidden">
{`<html>
  <head><link rel="stylesheet"
    href="app.css"></head>
  <body>
    <header>بیت‌کد</header>
    <main>
      <div class="card">ساختمان داده</div>
      <div class="card">شبکه</div>
      <div class="hidden">تبلیغ</div>
    </main>
    <footer>© ۱۴۰۵</footer>
  </body>
</html>`}
            </pre>
          ) : (
            <div className={`p-4 min-h-[240px] flex flex-col gap-2 relative ${step >= 6 ? "shadow-[inset_0_0_40px_rgba(63,216,182,0.06)]" : ""}`}>
              {/* header */}
              <div className={`${boxCls()} rounded h-9 relative ${fill("bg-night-700")}`}>
                {step >= 5 && <span className="absolute inset-0 grid place-items-center font-display text-[13px] text-amber">بیت‌کد</span>}
                {step === 4 && <span className="absolute -left-1 -top-2 font-code text-[8px] text-cyan bg-night-900 px-1">320×36</span>}
              </div>
              {/* cards */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {["ساختمان داده", "شبکه"].map((c, i) => (
                  <div key={c} className={`${boxCls()} rounded relative min-h-[72px] ${fill(i ? "bg-teal/15" : "bg-cyan/15")}`}>
                    {step >= 5 && <span className="absolute inset-0 grid place-items-center text-[11px] font-bold text-mist">{c}</span>}
                    {step === 4 && <span className="absolute -left-1 -top-2 font-code text-[8px] text-cyan bg-night-900 px-1">152×72</span>}
                  </div>
                ))}
              </div>
              {/* عنصر hidden */}
              <div
                className={`${boxCls("border-dashed")} rounded h-8 grid place-items-center text-[10px] transition-all duration-700 ${
                  step >= 3 ? "opacity-25 scale-y-50" : "opacity-70"
                } ${step < 3 ? "bg-night-800/50" : ""}`}
              >
                <span className={step >= 3 ? "line-through text-coral" : "text-faint"}>display: none — حذف از درخت رندر</span>
              </div>
              {/* footer */}
              <div className={`${boxCls()} rounded h-7 relative ${fill("bg-night-800")}`}>
                {step >= 5 && <span className="absolute inset-0 grid place-items-center text-[10px] text-faint">© ۱۴۰۵</span>}
              </div>

              {/* برچسب مرحله */}
              <span key={step} className="absolute bottom-2 right-2 font-code text-[9px] text-night-900 bg-amber rounded px-2 py-0.5 pop-in" dir="rtl">
                {steps[step].t}
              </span>
            </div>
          )}
        </div>

        {/* مراحل */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5 flex-1">
            {steps.map((s, i) => (
              <button
                key={s.t}
                onClick={() => { setStep(i); setPlaying(false); }}
                className={`w-full text-right rounded-md border px-3.5 py-2 transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                  i === step
                    ? "border-amber/60 bg-amber/10"
                    : i < step
                      ? "border-linec opacity-60"
                      : "border-linec hover:border-mist/25"
                }`}
              >
                <span className={`shrink-0 w-6 h-6 grid place-items-center rounded-full border font-code text-[10px] ${
                  i < step ? "bg-teal border-teal text-night-900" : i === step ? "border-amber text-amber" : "border-linec text-faint"
                }`}>
                  {i < step ? "✓" : fa(i + 1)}
                </span>
                <span className={`text-[12.5px] font-bold ${i === step ? "text-amber" : "text-dim"}`}>{s.t}</span>
              </button>
            ))}
          </div>

          <div key={step} className="pop-in border border-linec bg-night-800/60 rounded-md p-4 min-h-[76px]">
            <p className="text-dim text-[12.5px] leading-7">{steps[step].d}</p>
          </div>

          <div className="flex items-center gap-2">
            <VBtn onClick={() => { setStep((s) => (s + 1) % steps.length); setPlaying(false); }} disabled={playing}>
              قدم بعدی
            </VBtn>
            <VBtn onClick={() => setPlaying((p) => !p)} active={playing}>
              {playing ? "توقف" : "پخش خودکار"}
            </VBtn>
            <VBtn onClick={() => { setStep(0); setPlaying(false); }}>از اول</VBtn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- زمین‌بازی Flexbox ---------- */
function FlexPlay() {
  const [dir, setDir] = useState<"row" | "column">("row");
  const [jc, setJc] = useState("center");
  const [ai, setAi] = useState("center");
  const [wrap, setWrap] = useState(false);
  const [gap, setGap] = useState(10);

  const JC = ["flex-start", "center", "flex-end", "space-between", "space-around"];
  const AI = ["stretch", "flex-start", "center", "flex-end"];
  const items = [
    { n: 1, c: "bg-amber/80", h: "h-10" },
    { n: 2, c: "bg-teal/80", h: "h-16" },
    { n: 3, c: "bg-cyan/80", h: "h-8" },
    { n: 4, c: "bg-coral/80", h: "h-12" },
    { n: 5, c: "bg-mist/70", h: "h-9" },
  ];

  const Seg = ({ label, opts, val, onChange }: { label: string; opts: string[]; val: string; onChange: (v: string) => void }) => (
    <div>
      <p className="text-[11px] text-faint font-code mb-1.5" dir="ltr">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`font-code text-[10.5px] rounded border px-2 py-1 transition-all duration-200 cursor-pointer ${
              val === o ? "bg-amber text-night-900 border-amber" : "border-linec text-dim hover:border-amber/50 hover:text-mist"
            }`}
            dir="ltr"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Frame title="زمین‌بازی Flexbox — بچین و ببین" hint="گزینه‌ها را عوض کن و ببین جعبه‌ها چطور واکنش نشان می‌دهند؛ کد معادل هم زنده نوشته می‌شود. این یعنی درک Flexbox، نه حفظ‌کردنش.">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <div className="space-y-4">
            <Seg label="flex-direction" opts={["row", "column"]} val={dir} onChange={(v) => setDir(v as typeof dir)} />
            <Seg label="justify-content" opts={JC} val={jc} onChange={setJc} />
            <Seg label="align-items" opts={AI} val={ai} onChange={setAi} />
            <div className="flex items-center gap-5 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wrap}
                  onChange={(e) => setWrap(e.target.checked)}
                  className="accent-[#ffb454] w-4 h-4"
                />
                <span className="font-code text-[11px] text-dim" dir="ltr">flex-wrap: wrap</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="font-code text-[11px] text-dim" dir="ltr">gap: {fa(gap)}px</span>
                <input type="range" min={0} max={32} value={gap} onChange={(e) => setGap(+e.target.value)} className="w-24 accent-[#ffb454]" dir="ltr" />
              </label>
            </div>
          </div>

          <pre className="mt-5 rounded-md border border-linec bg-night-900 p-4 font-code text-[11px] leading-6 text-dim overflow-x-auto" dir="ltr">
{`.container {
  display: flex;
  flex-direction: ${dir};
  justify-content: ${jc};
  align-items: ${ai};${wrap ? "\n  flex-wrap: wrap;" : ""}
  gap: ${gap}px;
}`}
          </pre>
        </div>

        <div
          className="rounded-md border-2 border-dashed border-amber/30 bg-night-900/60 p-3 min-h-[300px] transition-all duration-500"
          style={{
            display: "flex",
            flexDirection: dir,
            justifyContent: jc,
            alignItems: ai,
            flexWrap: wrap ? "wrap" : "nowrap",
            gap: `${gap}px`,
          }}
          dir="ltr"
        >
          {items.map((it) => (
            <div
              key={it.n}
              className={`${it.c} ${ai === "stretch" ? "" : it.h} w-14 rounded grid place-items-center font-code font-bold text-night-900 text-sm transition-all duration-500 ${wrap ? "" : "shrink"}`}
              style={ai === "stretch" ? { alignSelf: "stretch", minHeight: 40 } : undefined}
            >
              {it.n}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- رجیستری ---------- */
const REGISTRY: Record<string, () => ReactNode> = {
  bigo: () => <BigO />,
  arrayInsert: () => <ArrayInsert />,
  linkedList: () => <LinkedList />,
  stack: () => <Stack />,
  queue: () => <Queue />,
  binarySearch: () => <BinarySearch />,
  sortRace: () => <SortRace />,
  hashTable: () => <HashTable />,
  recursionTree: () => <RecursionTree />,
  bst: () => <Bst />,
  gitGraph: () => <GitGraph />,
  httpCycle: () => <HttpCycle />,
  layers: () => <Layers />,
  stackHeap: () => <StackHeap />,
  deadlock: () => <Deadlock />,
  sdlc: () => <Sdlc />,
  microvmono: () => <Microvmono />,
  dockerLayers: () => <DockerLayers />,
  vibeLoop: () => <VibeLoop />,
  tcpHandshake: () => <TcpHandshake />,
  subnetCalc: () => <SubnetCalc />,
  chmodCalc: () => <ChmodCalc />,
  fhsTree: () => <FhsTree />,
  raftElection: () => <RaftElection />,
  consistentHash: () => <ConsistentHash />,
  renderPath: () => <RenderPath />,
  flexPlay: () => <FlexPlay />,
  bfsDfs: () => <BfsDfs />,
  dpTable: () => <DpTable />,
  lruCache: () => <LruCache />,
  tlsHandshake: () => <TlsHandshake />,
  quorum: () => <Quorum />,
  seqDiagram: () => <SeqDiagram />,
  onionArch: () => <OnionArch />,
  mktFunnel: () => <MktFunnel />,
  abTestCalc: () => <AbTestCalc />,
  sqlJoin: () => <SqlJoin />,
  reactLifecycle: () => <ReactLifecycle />,
  asyncFlow: () => <AsyncFlow />,
  numberConverter: () => <NumberConverter />,
  ciCdPipeline: () => <CiCdPipeline />,
  bTreeIndex: () => <BTreeIndex />,
  observerPattern: () => <ObserverPattern />,
  rateLimiter: () => <RateLimiter />,
  hashVsEncrypt: () => <HashVsEncrypt />,
};

/* ---------- حلقه وایب کدینگ ---------- */
function VibeLoop() {
  const steps = [
    { t: "مشخصات (Spec)", d: "هدف، صفحات، قوانین و «صریحاً نمی‌خواهم‌ها» را بنویس — جهتِ همه حلقه‌های بعدی همین‌جا تعیین می‌شود و گران‌ترین دقیقه پروژه است." },
    { t: "پرامپت دقیق", d: "نقش، زمینه، یک وظیفه، قیدها و قرارداد خروجی. هر تصمیمی که تو نگیری، Agent می‌گیرد — و سلیقه تو را ندارد." },
    { t: "تولید کد", d: "Agent چند فایل را همزمان می‌سازد. تازه‌کارها اینجا هیجان‌زده می‌شوند؛ حرفه‌ای‌ها شکاک می‌مانند." },
    { t: "اجرا و مشاهده", d: "برنامه را بالا بیاور و مثل کاربر واقعی کلیک کن — با ورودی بد، کلیک تکراری و فیلد خالی. دمو تنها قاضیِ صادق است." },
    { t: "بازخورد جهت‌دار", d: "دقیق بگو چه چیزی کج است («ذخیره دوبار صدا می‌شود») و Commit بزن — بعد دور بعد. بازنویسی نه؛ اصلاح." },
  ];
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % steps.length), 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="border border-linec bg-night-900/80 rounded-md p-5 select-none">
      <div className="flex flex-wrap items-center justify-center gap-y-3" dir="rtl">
        {steps.map((s, si) => (
          <span key={s.t} className="flex items-center">
            <button
              onClick={() => setI(si)}
              className={`px-3 py-2 rounded-md border text-[12px] font-bold transition-all duration-500 cursor-pointer whitespace-nowrap ${
                si === i
                  ? "bg-amber text-night-900 border-amber scale-110 shadow-[0_0_24px_rgba(255,180,84,0.3)]"
                  : "border-linec text-dim hover:border-amber/50 hover:text-mist"
              }`}
            >
              {fa(si + 1)}. {s.t}
            </button>
            {si < steps.length - 1 && (
              <svg viewBox="0 0 24 24" className={`w-5 h-5 mx-1 shrink-0 transition-colors duration-500 ${si === i ? "text-amber" : "text-faint"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 6-6 6 6 6" />
              </svg>
            )}
          </span>
        ))}
        <span className="flex items-center text-faint text-[11px] mr-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
          </svg>
          و دوباره…
        </span>
      </div>

      <div key={i} className="pop-in mt-4 border border-linec bg-night-800/60 rounded-md p-4 min-h-[84px]">
        <p className="font-bold text-amber text-sm">{steps[i].t}</p>
        <p className="text-dim text-[13px] leading-7 mt-1.5">{steps[i].d}</p>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-faint">
        <span>هر دور، محصول نزدیک‌تر می‌شود — به‌شرط اینکه دورها کوچک بمانند</span>
        <div className="flex gap-1.5">
          {steps.map((_, di) => (
            <button key={di} onClick={() => setI(di)} aria-label={`مرحله ${fa(di + 1)}`} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${di === i ? "w-6 bg-amber" : "w-2.5 bg-night-600 hover:bg-faint"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Visual({ name }: { name: string }) {
  const render = REGISTRY[name];
  if (!render) return null;
  return <>{render()}</>;
}
