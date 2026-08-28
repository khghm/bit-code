import { useEffect, useMemo, useState } from "react";
import { fa, usePrefersReducedMotion } from "../lib/hooks";

/* ---------- ابزارهای مشترک ---------- */
function Btn({ on, onClick, children, disabled }: { on?: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all duration-300 cursor-pointer ${
        on ? "bg-amber text-night-900 border-amber shadow-[0_0_16px_rgba(255,180,84,0.3)]" : "border-linec text-dim hover:border-amber/50 hover:text-mist"
      } ${disabled ? "opacity-40 cursor-default" : ""}`}
    >
      {children}
    </button>
  );
}

function Box({ title, children, foot }: { title: string; children: React.ReactNode; foot?: string }) {
  return (
    <div className="border border-linec bg-night-900/80 rounded-md p-5 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="font-display text-lg text-mist">{title}</p>
      </div>
      {children}
      {foot && <p className="text-[11.5px] text-faint mt-3 leading-6 border-t border-linec/70 pt-2.5">{foot}</p>}
    </div>
  );
}

/* ---------- ۱) مسابقه مرتب‌سازی ---------- */
export function SortRace() {
  const [algo, setAlgo] = useState<"bubble" | "quick" | "merge" | "insertion">("bubble");
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const reduced = usePrefersReducedMotion();

  const initial = [5, 3, 8, 1, 9, 2, 7, 4, 6];

  const steps = useMemo(() => {
    const snaps: { arr: number[]; comparing?: number[]; sorted?: number[] }[] = [{ arr: [...initial] }];
    const arr = [...initial];

    if (algo === "bubble") {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          snaps.push({ arr: [...arr], comparing: [j, j + 1] });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            snaps.push({ arr: [...arr], comparing: [j, j + 1] });
          }
        }
        snaps.push({ arr: [...arr], sorted: Array.from({ length: i + 1 }, (_, k) => arr.length - 1 - k) });
      }
    } else if (algo === "insertion") {
      for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        snaps.push({ arr: [...arr], comparing: [i] });
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          snaps.push({ arr: [...arr], comparing: [j, j + 1] });
          j--;
        }
        arr[j + 1] = key;
        snaps.push({ arr: [...arr], comparing: [j + 1] });
      }
    } else if (algo === "quick") {
      const a = [...arr];
      function partition(lo: number, hi: number) {
        const pivot = a[hi];
        let i = lo - 1;
        snaps.push({ arr: [...a], comparing: [hi] });
        for (let j = lo; j < hi; j++) {
          if (a[j] < pivot) {
            i++;
            [a[i], a[j]] = [a[j], a[i]];
            snaps.push({ arr: [...a], comparing: [i, j] });
          }
        }
        [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
        snaps.push({ arr: [...a], comparing: [i + 1] });
        return i + 1;
      }
      function qs(lo: number, hi: number) {
        if (lo < hi) {
          const p = partition(lo, hi);
          qs(lo, p - 1);
          qs(p + 1, hi);
        }
      }
      qs(0, a.length - 1);
      snaps.push({ arr: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) });
    } else {
      const a = [...arr];
      function merge(lo: number, mid: number, hi: number) {
        const left = a.slice(lo, mid + 1);
        const right = a.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) a[k++] = left[i++];
          else a[k++] = right[j++];
          snaps.push({ arr: [...a], comparing: [k - 1] });
        }
        while (i < left.length) { a[k++] = left[i++]; snaps.push({ arr: [...a], comparing: [k - 1] }); }
        while (j < right.length) { a[k++] = right[j++]; snaps.push({ arr: [...a], comparing: [k - 1] }); }
      }
      function ms(lo: number, hi: number) {
        if (lo < hi) {
          const mid = Math.floor((lo + hi) / 2);
          ms(lo, mid);
          ms(mid + 1, hi);
          merge(lo, mid, hi);
        }
      }
      ms(0, a.length - 1);
      snaps.push({ arr: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) });
    }
    snaps.push({ arr: [...arr].sort((a, b) => a - b), sorted: Array.from({ length: arr.length }, (_, i) => i) });
    return snaps;
  }, [algo]);

  useEffect(() => { setStep(0); setPlay(false); }, [algo]);

  useEffect(() => {
    if (!play || reduced) return;
    const speed = algo === "quick" || algo === "merge" ? 150 : 200;
    const id = window.setInterval(() => setStep((s) => (s >= steps.length - 1 ? (setPlay(false), s) : s + 1)), speed);
    return () => window.clearInterval(id);
  }, [play, reduced, steps.length, algo]);

  const cur = steps[step] || steps[0];
  const maxVal = Math.max(...initial);

  return (
    <Box title="مسابقه مرتب‌سازی: الگوریتم‌ها را ببین" foot="هر میله یک عدد است؛ میله‌های نارنجی در حال مقایسه، سبز مرتب‌شده‌اند. سرعت نسبی هر الگوریتم را ببین.">
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["bubble", "insertion", "quick", "merge"] as const).map((a) => (
          <Btn key={a} on={algo === a} onClick={() => setAlgo(a)}>
            {a === "bubble" ? "Bubble" : a === "insertion" ? "Insertion" : a === "quick" ? "Quick" : "Merge"}
          </Btn>
        ))}
      </div>
      <div className="flex items-end gap-1 h-32 mb-3" dir="ltr">
        {cur.arr.map((v, i) => {
          const isComparing = cur.comparing?.includes(i);
          const isSorted = cur.sorted?.includes(i);
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-200"
              style={{
                height: `${(v / maxVal) * 100}%`,
                background: isComparing ? "#ffb454" : isSorted ? "#3fd8b6" : "#5ec8a0",
                opacity: isSorted ? 1 : 0.8,
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-faint">
        <span>گام {fa(step + 1)} از {fa(steps.length)}</span>
        <div className="flex gap-2">
          <Btn on={false} onClick={() => setStep(Math.max(0, step - 1))}>← قبلی</Btn>
          <Btn on={play} onClick={() => setPlay(!play)}>{play ? "⏸ توقف" : "▶ اجرا"}</Btn>
          <Btn on={false} onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>بعدی →</Btn>
        </div>
      </div>
    </Box>
  );
}

/* ---------- ۲) عملگرهای SQL JOIN ---------- */
export function SqlJoin() {
  const [joinType, setJoinType] = useState<"inner" | "left" | "right" | "full">("inner");

  const users = [
    { id: 1, name: "علی" },
    { id: 2, name: "سارا" },
    { id: 3, name: "رضا" },
    { id: 4, name: "مریم" },
  ];

  const orders = [
    { id: 101, user_id: 1, item: "کتاب" },
    { id: 102, user_id: 1, item: "خودکار" },
    { id: 103, user_id: 2, item: "دفتر" },
    { id: 104, user_id: 5, item: "مداد" },
  ];

  const result = useMemo(() => {
    const r: { user: string | null; item: string | null; from: "left" | "right" | "both" }[] = [];
    if (joinType === "inner") {
      users.forEach((u) => orders.forEach((o) => { if (u.id === o.user_id) r.push({ user: u.name, item: o.item, from: "both" }); }));
    } else if (joinType === "left") {
      users.forEach((u) => {
        const matched = orders.filter((o) => o.user_id === u.id);
        if (matched.length) matched.forEach((o) => r.push({ user: u.name, item: o.item, from: "both" }));
        else r.push({ user: u.name, item: null, from: "left" });
      });
    } else if (joinType === "right") {
      orders.forEach((o) => {
        const matched = users.find((u) => u.id === o.user_id);
        if (matched) r.push({ user: matched.name, item: o.item, from: "both" });
        else r.push({ user: null, item: o.item, from: "right" });
      });
    } else {
      const usedUsers = new Set<number>();
      const usedOrders = new Set<number>();
      users.forEach((u) => {
        const matched = orders.filter((o) => o.user_id === u.id);
        if (matched.length) {
          matched.forEach((o) => { r.push({ user: u.name, item: o.item, from: "both" }); usedOrders.add(orders.indexOf(o)); });
          usedUsers.add(u.id);
        } else {
          r.push({ user: u.name, item: null, from: "left" });
        }
      });
      orders.forEach((o, i) => { if (!usedOrders.has(i)) r.push({ user: null, item: o.item, from: "right" }); });
    }
    return r;
  }, [joinType]);

  return (
    <Box title="SQL JOIN: نتیجه را ببین" foot="سبز = تطابق هر دو طرف | آبی = فقط جدول چپ | نارنجی = فقط جدول راست">
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["inner", "left", "right", "full"] as const).map((j) => (
          <Btn key={j} on={joinType === j} onClick={() => setJoinType(j)}>
            {j.toUpperCase()} JOIN
          </Btn>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="border border-linec rounded-md p-3">
          <p className="text-xs font-bold text-amber mb-2">users</p>
          <table className="w-full text-xs">
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-linec/50">
                  <td className="py-1 text-faint">{u.id}</td>
                  <td className="py-1 text-mist">{u.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-linec rounded-md p-3">
          <p className="text-xs font-bold text-amber mb-2">orders</p>
          <table className="w-full text-xs">
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-linec/50">
                  <td className="py-1 text-faint">{o.id}</td>
                  <td className="py-1 text-faint">{o.user_id}</td>
                  <td className="py-1 text-mist">{o.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border border-amber/30 rounded-md p-3 bg-amber/5">
        <p className="text-xs font-bold text-amber mb-2">نتیجه {joinType.toUpperCase()} JOIN ({fa(result.length)} ردیف)</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-linec">
              <th className="py-1 text-right text-dim">user</th>
              <th className="py-1 text-right text-dim">item</th>
            </tr>
          </thead>
          <tbody>
            {result.map((r, i) => (
              <tr key={i} className={`border-t border-linec/30 ${r.from === "both" ? "bg-teal/10" : r.from === "left" ? "bg-cyan/10" : "bg-amber/10"}`}>
                <td className="py-1 text-mist">{r.user ?? <span className="text-faint">NULL</span>}</td>
                <td className="py-1 text-mist">{r.item ?? <span className="text-faint">NULL</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

/* ---------- چرخه حایت کامپوننت React ---------- */
export function ReactLifecycle() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { name: "Mount", desc: "کامپوننت به DOM اضافه می‌شود", method: "componentDidMount / useEffect(() => {}, [])", color: "#3fd8b6" },
    { name: "Update", desc: "State یا Props تغییر کرد", method: "componentDidUpdate / useEffect(() => {}, [dep])", color: "#ffb454" },
    { name: "Unmount", desc: "کامپوننت از DOM حذف می‌شود", method: "componentWillUnmount / useEffect(() => { return () => {} })", color: "#ff7a63" },
  ];

  return (
    <Box title="چرخه حیات کامپوننت React" foot="هر فاز، یک Hook/متد متناظر دارد — توقفت کن و هر کدام را بررسی کن.">
      <div className="flex items-center justify-center gap-4 mb-6">
        {phases.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setPhase(i)}
            className={`flex flex-col items-center gap-2 p-4 rounded-md border transition-all cursor-pointer ${
              phase === i ? "border-amber bg-amber/10 scale-105" : "border-linec hover:border-amber/50"
            }`}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: p.color + "22", color: p.color }}>
              {fa(i + 1)}
            </div>
            <span className="text-sm font-bold text-mist">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="border border-linec rounded-md p-4 bg-night-800/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ background: phases[phase].color }} />
          <h4 className="font-display text-lg text-mist">{phases[phase].name}</h4>
        </div>
        <p className="text-sm text-dim mb-3">{phases[phase].desc}</p>
        <code className="text-xs text-amber bg-night-900 px-3 py-2 rounded block" dir="ltr">{phases[phase].method}</code>
      </div>
    </Box>
  );
}

/* ---------- Async/Await Flow ---------- */
export function AsyncFlow() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();

  const steps = [
    { label: "شروع", detail: "تابع async فراخوانی می‌شود", thread: "main", color: "#5ec8ea" },
    { label: "await fetch()", detail: "درخواست HTTP ارسال می‌شود، تراد آزاد می‌شود", thread: "network", color: "#ffb454" },
    { label: "پردازش دیگر", detail: "سایر کدها اجرا می‌شوند (non-blocking)", thread: "main", color: "#3fd8b6" },
    { label: "پاسخ رسید", detail: "Promise resolve می‌شود", thread: "network", color: "#ffb454" },
    { label: "ادامه", detail: "Control به تابع async برمی‌گردد", thread: "main", color: "#5ec8ea" },
  ];

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => setStep((s) => (s >= steps.length - 1 ? (setPlaying(false), s) : s + 1)), 1200);
    return () => window.clearInterval(id);
  }, [playing, reduced, steps.length]);

  return (
    <Box title="Async/Await: جریان اجرای غیرهمزمان" foot="نارنجی = عملیات شبکه | آبی/سبز = تراد اصلی. ببین چطور تراد اصلی مسدود نمی‌شود.">
      <div className="space-y-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-300 ${
              step === i ? "border-amber bg-amber/10" : step > i ? "border-linec/50 opacity-50" : "border-linec/30"
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: s.color + "22", color: s.color }}>
              {fa(i + 1)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-mist">{s.label}</p>
              <p className="text-xs text-faint">{s.detail}</p>
            </div>
            <span className={`text-[10px] font-code px-2 py-1 rounded ${s.thread === "main" ? "bg-cyan/10 text-cyan" : "bg-amber/10 text-amber"}`}>
              {s.thread}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Btn on={false} onClick={() => setStep(Math.max(0, step - 1))}>←</Btn>
        <Btn on={playing} onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "▶ اجرا"}</Btn>
        <Btn on={false} onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>→</Btn>
      </div>
    </Box>
  );
}

/* ---------- ۵) مبدل عددی (دودویی/هگز) ---------- */
export function NumberConverter() {
  const [input, setInput] = useState("42");
  const [mode, setMode] = useState<"dec" | "bin" | "hex">("dec");

  const result = useMemo(() => {
    let dec: number;
    try {
      if (mode === "dec") dec = parseInt(input, 10);
      else if (mode === "bin") dec = parseInt(input, 2);
      else dec = parseInt(input, 16);
      if (isNaN(dec)) return null;
      return {
        dec: dec.toString(10),
        bin: dec.toString(2),
        hex: dec.toString(16).toUpperCase(),
        oct: dec.toString(8),
      };
    } catch {
      return null;
    }
  }, [input, mode]);

  return (
    <Box title="مبدل عددی: دهدهی، دودویی، هگزادهدهی" foot="عدد را وارد کن و معادلش را در همه سیستم‌ها ببین.">
      <div className="flex gap-2 mb-4">
        {(["dec", "bin", "hex"] as const).map((m) => (
          <Btn key={m} on={mode === m} onClick={() => setMode(m)}>
            {m === "dec" ? "دهدهی" : m === "bin" ? "دودویی" : "هگزادهدهی"}
          </Btn>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-night-950 border border-linec rounded-md px-4 py-3 text-mist text-center font-code text-lg mb-4 outline-none focus:border-amber/60"
        dir="ltr"
        placeholder={mode === "dec" ? "42" : mode === "bin" ? "101010" : "2A"}
      />
      {result ? (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "DEC", value: result.dec, color: "#5ec8ea" },
            { label: "BIN", value: result.bin, color: "#ffb454" },
            { label: "HEX", value: result.hex, color: "#3fd8b6" },
          ].map((r) => (
            <div key={r.label} className="border border-linec rounded-md p-3 text-center">
              <p className="text-[10px] font-code text-faint mb-1">{r.label}</p>
              <p className="font-code text-lg" style={{ color: r.color }} dir="ltr">{r.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-coral text-sm">ورودی نامعتبر است</p>
      )}
    </Box>
  );
}

/* ---------- ۶) خط لوله CI/CD ---------- */
export function CiCdPipeline() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();

  const stages = [
    { name: "Push", icon: "📦", desc: "کد به مخزن ارسال می‌شود", color: "#5ec8ea" },
    { name: "Build", icon: "🔨", desc: "کامپایل و ساخت بسته", color: "#ffb454" },
    { name: "Test", icon: "🧪", desc: "اجرای تست‌های خودکار", color: "#3fd8b6" },
    { name: "Security", icon: "🔒", desc: "بررسی آسیب‌پذیری", color: "#e8b4ff" },
    { name: "Deploy Staging", icon: "🎭", desc: "استقرار در محیط آزمایشی", color: "#ff7a63" },
    { name: "Deploy Prod", icon: "🚀", desc: "استقرار در محیط تولید", color: "#3fd8b6" },
  ];

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => setStep((s) => (s >= stages.length - 1 ? (setPlaying(false), s) : s + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing, reduced, stages.length]);

  return (
    <Box title="خط لوله CI/CD: از Push تا Deploy" foot="هر مرحله خودکار است — اگر مرحله‌ای شکست بخورد، خط لوله متوقف می‌شود.">
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {stages.map((s, i) => (
          <div key={s.name} className="flex items-center">
            <button
              onClick={() => setStep(i)}
              className={`flex flex-col items-center gap-1 p-3 rounded-md border min-w-[80px] transition-all cursor-pointer ${
                step === i ? "border-amber bg-amber/10 scale-105" : step > i ? "border-teal/50 bg-teal/5" : "border-linec"
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-[10px] font-bold text-mist whitespace-nowrap">{s.name}</span>
              {step > i && <span className="text-[10px] text-teal">✓</span>}
            </button>
            {i < stages.length - 1 && (
              <div className={`w-4 h-0.5 mx-1 ${step > i ? "bg-teal" : "bg-linec"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="border border-linec rounded-md p-4 bg-night-800/60">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{stages[step].icon}</span>
          <div>
            <p className="font-bold text-mist">{stages[step].name}</p>
            <p className="text-sm text-dim">{stages[step].desc}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <Btn on={false} onClick={() => setStep(Math.max(0, step - 1))}>←</Btn>
        <Btn on={playing} onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "▶ اجرا"}</Btn>
        <Btn on={false} onClick={() => setStep(Math.min(stages.length - 1, step + 1))}>→</Btn>
      </div>
    </Box>
  );
}

/* ---------- ۷) ایندکس‌گذاری دیتابیس (B-Tree) ---------- */
export function BTreeIndex() {
  const [value, setValue] = useState("42");
  const [steps, setSteps] = useState<number[]>([]);
  const [searching, setSearching] = useState(false);

  const data = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const indexed = [20, 40, 60, 80];

  const search = () => {
    const target = parseInt(value);
    if (isNaN(target)) return;
    setSearching(true);
    const path: number[] = [];
    let lo = 0, hi = indexed.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      path.push(indexed[mid]);
      if (indexed[mid] === target) break;
      else if (indexed[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    let step = 0;
    const id = window.setInterval(() => {
      if (step >= path.length) { window.clearInterval(id); setSearching(false); return; }
      setSteps(path.slice(0, step + 1));
      step++;
    }, 500);
  };

  return (
    <Box title="ایندکس B-Tree: جست‌وجوی سریع‌تر" foot="بدون ایندکس: ۹ مقایسه | با ایندکس: ۲-۳ مقایسه. تفاوت را با چشمت ببین.">
      <div className="mb-4">
        <p className="text-xs text-dim mb-2">داده‌ها:</p>
        <div className="flex gap-1 flex-wrap">
          {data.map((d) => (
            <span key={d} className="px-2 py-1 bg-night-800 border border-linec rounded text-xs text-mist font-code">{d}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-dim mb-2">ایندکس (ساختار B-Tree ساده‌شده):</p>
        <div className="flex gap-1 flex-wrap">
          {indexed.map((d) => (
            <span
              key={d}
              className={`px-2 py-1 border rounded text-xs font-code transition-all ${
                steps.includes(d) ? steps[steps.length - 1] === d ? "bg-amber text-night-900 border-amber" : "bg-teal/20 text-teal border-teal" : "bg-night-800 border-linec text-mist"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-night-950 border border-linec rounded-md px-3 py-2 text-mist text-sm font-code w-24 outline-none focus:border-amber/60"
          dir="ltr"
        />
        <Btn on={searching} onClick={search} disabled={searching}>جست‌وجو</Btn>
        {steps.length > 0 && <span className="text-xs text-faint">مقایسه‌ها: {fa(steps.length)}</span>}
      </div>
    </Box>
  );
}

/* ---------- ۸) الگوی طراحی Observer ---------- */
export function ObserverPattern() {
  const [subscribers, setSubscribers] = useState<string[]>(["علی", "سارا"]);
  const [log, setLog] = useState<string[]>([]);

  const publish = (msg: string) => {
    const entries = subscribers.map((s) => `📨 ${s}: "${msg}" دریافت کرد`);
    setLog([...entries, ...log].slice(0, 8));
  };

  return (
    <Box title="الگوی Observer: انتشار رویداد" foot="Subject تغییر می‌دهد → همین Subscribers مطلع می‌شوند. بدون اینکه بداند چه کسی گوش می‌دهد.">
      <div className="flex gap-2 mb-4 flex-wrap">
        <Btn on={false} onClick={() => publish("محصول جدید منتشر شد!")}>انتشار رویداد</Btn>
        <Btn on={false} onClick={() => { setSubscribers([...subscribers, "کاربر " + fa(subscribers.length + 1)]); }}>+ مشترک جدید</Btn>
        <Btn on={false} onClick={() => setLog([])}>پاک‌کردن</Btn>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 border border-linec rounded-md p-3">
          <p className="text-xs text-amber font-bold mb-2">Subject (منبع)</p>
          <div className="w-12 h-12 rounded-full bg-amber/20 border-2 border-amber mx-auto flex items-center justify-center text-amber text-xl">📡</div>
        </div>
        <div className="flex-1 border border-linec rounded-md p-3">
          <p className="text-xs text-teal font-bold mb-2">Subscribers ({fa(subscribers.length)})</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {subscribers.map((s) => (
              <span key={s} className="text-[10px] bg-teal/10 text-teal px-2 py-1 rounded">{s}</span>
            ))}
          </div>
        </div>
      </div>
      {log.length > 0 && (
        <div className="border border-linec rounded-md p-3 bg-night-800/40 max-h-32 overflow-y-auto">
          {log.map((l, i) => (
            <p key={i} className="text-xs text-dim py-1 border-b border-linec/30 last:border-0">{l}</p>
          ))}
        </div>
      )}
    </Box>
  );
}

/* ---------- ۹) محدودیت نرخ (Rate Limiter) ---------- */
export function RateLimiter() {
  const [requests, setRequests] = useState<number[]>([]);
  const limit = 5;
  const windowMs = 10000;

  const addRequest = () => {
    const now = Date.now();
    setRequests((prev) => [...prev, now]);
  };

  const activeRequests = requests.filter((t) => Date.now() - t < windowMs);
  const isLimited = activeRequests.length >= limit;

  useEffect(() => {
    const id = window.setInterval(() => {
      setRequests((prev) => prev.filter((t) => Date.now() - t < windowMs));
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Box title="Rate Limiter: محدودیت تعداد درخواست" foot={`فقط ${fa(limit)} درخواست در هر ${fa(10)} ثانیه مجاز است. بقیه رد می‌شوند.`}>
      <div className="flex items-center gap-4 mb-4">
        <Btn on={false} onClick={addRequest} disabled={isLimited}>ارسال درخواست</Btn>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-dim">ظرفیت:</span>
            <span className={`text-sm font-bold ${isLimited ? "text-coral" : "text-teal"}`}>{fa(activeRequests.length)}/{fa(limit)}</span>
          </div>
          <div className="h-2 bg-night-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isLimited ? "bg-coral" : "bg-teal"}`}
              style={{ width: `${(activeRequests.length / limit) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {isLimited && (
        <div className="border border-coral/30 bg-coral/5 rounded-md p-3 text-center">
          <p className="text-coral text-sm font-bold">⚠ محدودیت فعال شد! درخواست بعدی رد می‌شود</p>
          <p className="text-xs text-faint mt-1">HTTP 429 Too Many Requests</p>
        </div>
      )}
      <p className="text-[10px] text-faint mt-3">درخواست‌های قدیمی‌تر از ۱۰ ثانیه خودکار حذف می‌شوند</p>
    </Box>
  );
}

/* ---------- ۱۰) رمزنگاری vs هش ---------- */
export function HashVsEncrypt() {
  const [input, setInput] = useState("سلام دنیا");
  const [mode, setMode] = useState<"hash" | "encrypt">("hash");

  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).padStart(8, '0').toUpperCase();
  };

  const fakeEncrypt = (s: string) => {
    return btoa(unescape(encodeURIComponent(s))).slice(0, 24) + "...";
  };

  return (
    <Box title="هش vs رمزنگاری: تفاوت را ببین" foot="هش: یک‌طرفه و غیرقابل بازگشت | رمزنگاری: دوطرفه و با کلید قابل بازگشت">
      <div className="flex gap-2 mb-4">
        <Btn on={mode === "hash"} onClick={() => setMode("hash")}>هش (Hash)</Btn>
        <Btn on={mode === "encrypt"} onClick={() => setMode("encrypt")}>رمزنگاری (Encrypt)</Btn>
      </div>
      <div className="mb-4">
        <p className="text-xs text-dim mb-2">ورودی:</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-night-950 border border-linec rounded-md px-4 py-2 text-mist outline-none focus:border-amber/60"
        />
      </div>
      <div className="border border-linec rounded-md p-4 bg-night-800/40">
        <p className="text-xs text-dim mb-2">خروجی ({mode === "hash" ? "هش SHA-like" : "رمزنگاری Base64"}):</p>
        <p className="font-code text-sm text-amber break-all" dir="ltr">
          {mode === "hash" ? hash(input) : fakeEncrypt(input)}
        </p>
        {mode === "hash" && (
          <p className="text-[10px] text-faint mt-2">⚠ از خروجی نمی‌توان به ورودی برگشت — برای ذخیره رمز عبور مناسب است</p>
        )}
        {mode === "encrypt" && (
          <p className="text-[10px] text-faint mt-2">✓ با کلید می‌توان متن اصلی را بازیابی کرد — برای انتقال داده حساس</p>
        )}
      </div>
    </Box>
  );
}

/* ---------- رجیستری ---------- */
export const REGISTRY: Record<string, () => React.ReactNode> = {
  sortRace: () => <SortRace />,
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
