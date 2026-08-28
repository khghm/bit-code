import type { Block, CourseContent, Lesson } from "./content-types";
import { CONTENT_A } from "./content1";
import { CONTENT_B } from "./content2";
import { CONTENT_C } from "./content3";
import { CONTENT_NEW } from "./content-new";
import { EXTRA_LESSONS_A } from "./content4";
import { EXTRA_LESSONS_B } from "./content5";
import { EXTRA_LESSONS_C } from "./content6";
import { VIBE_A } from "./content-vibe1";
import { VIBE_B } from "./content-vibe2";
import { BULK1 } from "./bulk1";
import { BULK2 } from "./bulk2";
import { BULK3 } from "./bulk3";
import { BULK4 } from "./bulk4";
import { BULK5 } from "./bulk5";
import { BULK6 } from "./bulk6";
import { EXPAND1 } from "./expand1";
import { EXPAND2 } from "./expand2";
import { EXPAND3 } from "./expand3";
import { EXPAND4 } from "./expand4";
import { EXPAND5 } from "./expand5";
import { EXPAND6 } from "./expand6";
import { EXPAND7 } from "./expand7";
import { EXPAND8 } from "./expand8";
import { EXPAND9 } from "./expand9";
import { EXPAND10 } from "./expand10";
import { EXPAND11 } from "./expand11";
import { EXPAND12 } from "./expand12";
import { EXPAND13 } from "./expand13";
import { EXPAND14 } from "./expand14";
import { expandLesson, type LessonExpand } from "./gen";
import { DEEP_A } from "./deepdive1";
import { DEEP_B } from "./deepdive2";
import { DEEP_C } from "./deepdive3";
import { DEEP_D } from "./deepdive4";
import { DEEP_E } from "./deepdive5";
import { DEEP_F } from "./deepdive6";
import { RICH1 } from "./rich1";
import { RICH2 } from "./rich2";
import { RICH3 } from "./rich3";
import { RICH4 } from "./rich4";
import { RICH5 } from "./rich5";
import { RICH6 } from "./rich6";
import { RICH7_NET } from "./rich7";
import { UBUNTU_COMPACT, UBUNTU_RICH } from "./ubuntu-course";
import { DIST_COMPACT, DIST_RICH } from "./dist-course";
import { WEB_COMPACT, WEB_RICH } from "./web-course";
import { MKT_COMPACT, MKT_RICH } from "./mkt-course";

/* درس‌های «غنی» — استاندارد آموزشی کامل؛ اولویت هر دوره */
const RICH: Record<string, Lesson[]> = { ...RICH1, ...RICH2, ...RICH3, ...RICH4, ...RICH5, ...RICH6 };
RICH.net = [...(RICH.net ?? []), ...RICH7_NET];

const ALL: CourseContent[] = [...CONTENT_A, ...CONTENT_B, ...CONTENT_C, ...CONTENT_NEW];

const byId = new Map(ALL.map((c) => [c.id, c]));
const lessonById = new Map(
  [...EXTRA_LESSONS_A, ...EXTRA_LESSONS_B, ...EXTRA_LESSONS_C].map((l) => [l.id, l])
);

/* لایه «عمیق‌تر»: متن تکمیلی مفصل برای درس‌های پایه */
const DEEP: Record<string, Block[]> = { ...DEEP_A, ...DEEP_B, ...DEEP_C, ...DEEP_D, ...DEEP_E, ...DEEP_F };

/* هیچ‌گاه در زمان بارگذاری استثنا پرتاب نمی‌کنیم — امنیت کامل Preview */
const pick = (id: string): CourseContent => {
  const c = byId.get(id);
  if (!c) {
    if (typeof console !== "undefined") console.warn(`[bitcode] محتوای ${id} پیدا نشد`);
    return { id, intro: "محتوای این دوره در حال آماده‌سازی است.", outcomes: [], lessons: [] } as CourseContent;
  }
  return c;
};
const lesson = (id: string): Lesson => {
  const l = lessonById.get(id);
  if (!l) {
    if (typeof console !== "undefined") console.warn(`[bitcode] درس ${id} پیدا نشد`);
    return {
      id,
      title: "درس در حال آماده‌سازی",
      minutes: 30,
      blocks: [{ k: "p", t: "محتوای این درس به‌زودی اضافه می‌شود." }],
      quiz: [],
    };
  }
  return l;
};

/* ---------- شبیه‌سازهای تزریق‌شده به درس‌ها ---------- */
const VISUALS: Record<string, { visual: string; title: string; pos: number }[]> = {
  "c3-l1": [{ visual: "bigo", title: "شبیه‌ساز: منحنی‌های پیچیدگی", pos: 2 }],
  "c3-l2": [
    { visual: "arrayInsert", title: "شبیه‌ساز: درج در آرایه", pos: 2 },
    { visual: "linkedList", title: "شبیه‌ساز: لیست پیوندی", pos: 3 },
  ],
  "c3-l3": [
    { visual: "stack", title: "شبیه‌ساز: پشته", pos: 2 },
    { visual: "queue", title: "شبیه‌ساز: صف", pos: 3 },
  ],
  "c3-l4": [{ visual: "sortRace", title: "مسابقه مرتب‌سازی", pos: 2 }],
  "c4-l1": [{ visual: "binarySearch", title: "شبیه‌ساز: جست‌وجوی دودویی", pos: 2 }],
  "c4-l2": [{ visual: "recursionTree", title: "شبیه‌ساز: درخت فراخوانی", pos: 2 }],
  "c5-l1": [{ visual: "sdlc", title: "شبیه‌ساز: چرخه حیات نرم‌افزار", pos: 2 }],
  "c14-l1": [{ visual: "gitGraph", title: "شبیه‌ساز: شعبه و ادغام در Git", pos: 2 }],
  "c15-l2": [{ visual: "dockerLayers", title: "شبیه‌ساز: کانتینر در برابر VM", pos: 2 }],
  "c15-l3": [{ visual: "ciCdPipeline", title: "خط لوله CI/CD", pos: 2 }],
  "c12-l1": [{ visual: "microvmono", title: "شبیه‌ساز: سبک‌های معماری", pos: 2 }],
  "n-net-l1": [{ visual: "layers", title: "شبیه‌ساز: لایه‌های شبکه", pos: 2 }],
  "n-net-l2": [{ visual: "httpCycle", title: "شبیه‌ساز: چرخه یک درخواست", pos: 2 }],
  "net-r2": [{ visual: "tcpHandshake", title: "شبیه‌ساز: دست‌دادن سه‌راهی TCP", pos: 2 }],
  "net-r3": [{ visual: "subnetCalc", title: "ابزار تعاملی: محاسبه‌گر زیرشبکه", pos: 2 }],
  "ub-r2": [{ visual: "fhsTree", title: "شبیه‌ساز: نقشه فایل‌سیستم FHS", pos: 2 }],
  "ub-r4": [{ visual: "chmodCalc", title: "شبیه‌ساز: ماشین‌حساب chmod", pos: 2 }],
  "ds-r3": [{ visual: "raftElection", title: "شبیه‌ساز: انتخاب رهبر Raft", pos: 2 }],
  "ds-r5": [{ visual: "consistentHash", title: "شبیه‌ساز: حلقه هش‌گذاری سازگار", pos: 2 }],
  "web-r1": [{ visual: "renderPath", title: "شبیه‌ساز: مسیر رندر بحرانی", pos: 2 }],
  "web-r3": [{ visual: "flexPlay", title: "زمین‌بازی: Flexbox زنده", pos: 2 }],
  "n-os-l1": [{ visual: "stackHeap", title: "شبیه‌ساز: Stack و Heap", pos: 2 }],
  "n-os-l2": [{ visual: "deadlock", title: "شبیه‌ساز: بن‌بست", pos: 2 }],
  "n-cpp-l1": [{ visual: "stackHeap", title: "شبیه‌ساز: حافظه Stack و Heap", pos: 2 }],
  "n-java-l1": [{ visual: "stackHeap", title: "شبیه‌ساز: مرجع در Stack، شی در Heap", pos: 2 }],
  "c11-l2": [{ visual: "hashTable", title: "شبیه‌ساز: ایندکس، هشِ دیتابیس", pos: 2 }],
  "c11-l3": [{ visual: "sqlJoin", title: "عملگرهای SQL JOIN", pos: 2 }],
  "c11-l4": [{ visual: "bTreeIndex", title: "ایندکس‌گذاری B-Tree", pos: 2 }],
  "c2-l1": [{ visual: "stackHeap", title: "شبیه‌ساز: متغیر و حافظه", pos: 3 }],
  "v-l1": [{ visual: "vibeLoop", title: "شبیه‌ساز: حلقه وایب کدینگ", pos: 2 }],
  "mkt-r1": [{ visual: "mktFunnel", title: "شبیه‌ساز: قیف بازاریابی", pos: 2 }],
  "mkt-r8": [{ visual: "abTestCalc", title: "ابزار تعاملی: ماشین‌حساب A/B Test", pos: 2 }],
  "py-r1": [{ visual: "numberConverter", title: "مبدل عددی", pos: 2 }],
  "react-r1": [{ visual: "reactLifecycle", title: "چرخه حیات کامپوننت React", pos: 2 }],
  "node-r1": [{ visual: "asyncFlow", title: "جریان Async/Await", pos: 2 }],
  "dp-r1": [{ visual: "observerPattern", title: "الگوی Observer", pos: 2 }],
  "net-r5": [{ visual: "rateLimiter", title: "محدودیت نرخ (Rate Limiter)", pos: 2 }],
  "se-r2": [{ visual: "hashVsEncrypt", title: "هش vs رمزنگاری", pos: 2 }],
};

/* ---------- درس‌های حجمی (bulk) هر دوره ---------- */
const EXPAND: Record<string, LessonExpand> = {
  ...EXPAND1, ...EXPAND2, ...EXPAND3, ...EXPAND4, ...EXPAND5, ...EXPAND6,
  ...EXPAND7, ...EXPAND8, ...EXPAND9, ...EXPAND10, ...EXPAND11, ...EXPAND12,
  ...EXPAND13, ...EXPAND14,
};

const RAW_BULK: Record<string, Lesson[]> = {
  ...BULK1, ...BULK2, ...BULK3, ...BULK4, ...BULK5, ...BULK6,
};

/* هر درس فشرده‌ای که لایه گسترش دارد، به درس مفصل تبدیل می‌شود */
const BULK: Record<string, Lesson[]> = Object.fromEntries(
  Object.entries(RAW_BULK).map(([k, ls]) => [
    k,
    ls.map((l) => (EXPAND[l.id] ? expandLesson(l, EXPAND[l.id]) : l)),
  ])
);

/* ---------- درس‌های تکمیلی هر دوره ---------- */
const COURSE_EXTRAS: Record<string, string[]> = {
  py: ["py-x1", "py-x2"],
  dsa: ["dsa-x1", "dsa-x2", "dsa-x3"],
  algo: ["algo-x1", "algo-x2", "algo-x3"],
  se: ["se-x1"],
  java: ["java-x1"],
  cpp: ["cpp-x1"],
  os: ["os-x1"],
  dp: ["dp-x1"],
  net: ["net-x1"],
  react: ["react-x1", "react-x2"],
  node: ["node-x1", "node-x2"],
  sql: ["sql-x1"],
  arch: ["arch-x1"],
  devops: ["devops-x1"],
  ml: ["ml-x1"],
  test: ["test-x1"],
  git: ["se-x1"],
};

/* ---------- تزریق‌ها ---------- */
const injectVisualsLesson = (l: Lesson): Lesson => {
  const extra = VISUALS[l.id];
  if (!extra) return l;
  const blocks = [...l.blocks];
  [...extra].sort((a, b) => b.pos - a.pos).forEach((e) =>
    blocks.splice(e.pos, 0, { k: "visual", visual: e.visual, title: e.title })
  );
  return { ...l, blocks };
};

const applyDeep = (l: Lesson): Lesson => {
  const deep = DEEP[l.id];
  return deep ? { ...l, blocks: [...l.blocks, ...deep] } : l;
};

const finalizeLessons = (ls: Lesson[]): Lesson[] => ls.map(injectVisualsLesson).map(applyDeep);

const build = (
  base: CourseContent,
  courseId: string,
  opts: { before?: string[]; after?: string[] } = {}
): CourseContent => {
  const core = finalizeLessons([
    ...(opts.before ?? []).flatMap((id) => pick(id).lessons),
    ...base.lessons,
    ...(opts.after ?? []).flatMap((id) => pick(id).lessons),
  ]);
  const rich = RICH[courseId] ?? [];
  const extras = (COURSE_EXTRAS[courseId] ?? []).map(lesson);
  const bulk = BULK[courseId] ?? [];
  return { id: courseId, intro: base.intro, outcomes: base.outcomes, lessons: [...rich, ...core, ...extras, ...bulk] };
};

/* ---------- دوره وایب کدینگ ---------- */
const VIBE: CourseContent = {
  id: "vibe",
  intro:
    "فوریه ۲۰۲۵ واژه‌ای ساخته شد که صنعت را تکان داد: Vibe Coding — برنامه‌نویسی با هم‌نشینی هوش مصنوعی، جایی که تو مسیر را مشخص می‌کنی و Agentها پارو می‌زنند. این دوره رایگان، از فلسفه و تاریخچه شروع می‌کند، مهندسی پرامپت و جعبه‌ابزار را می‌سازد، یک MVP واقعی را در یک روز بالا می‌آورد و با کیفیت، امنیت و آینده Agentها تمام می‌شود. پیش‌نیاز: آشنایی مقدماتی با برنامه‌نویسی در هر زبانی.",
  outcomes: [
    "درک عمیق حلقه وایب و جای درستش — کجا رها کنی، کجا فرمان بگیری",
    "نوشتن Spec و پرامپت‌های مهندسی‌شده با الگوهای تکرارشونده",
    "تسلط بر جریان کاری Cursor، Copilot و Agentها",
    "ساخت یک MVP کامل از صفر تا دموی قابل‌ارائه",
    "بازبینی، تست و ایمن‌سازی خروجی هوش مصنوعی",
    "آمادگی برای عصر Agentها، MCP و مهارت‌های کمیاب جدید",
  ],
  lessons: [...VIBE_A, ...VIBE_B, ...(BULK.vibe ?? [])],
};

/* ---------- دوره لینوکس اوبونتو ---------- */
const LINUX: CourseContent = {
  id: "linux",
  intro:
    "لینوکس زیرزمین دنیای نرم‌افزار است: ۹۰٪ سرورهای ابری، همه ابررایانه‌ها و زیرساخت هر محصول دیجیتال روی آن می‌دود. این دوره اوبونتو را از صفر مطلق — نصب و شناخت سیستم — تا مدیریت یک سرور تولید می‌برد: فایل‌سیستم و مجوزها، processها و systemd، اسکریپت‌نویسی Bash، شبکه و SSH امن، لاگ‌ها و عیب‌یابی سیستماتیک، امنیت و سخت‌سازی، دیسک و اتوماسیون. هر درس با فرمان‌هایی که همان روز روی سرور واقعی استفاده می‌کنی.",
  outcomes: [
    "راحتی کامل با ترمینال، ناوبری و ترکیب فرمان‌ها با pipe",
    "مدیریت کاربران، گروه‌ها و مجوزهای rwx بدون ترس",
    "نوشتن سرویس‌های systemd خودترمیم و اسکریپت‌های Bash مهندسی‌شده",
    "پیکربندی شبکه، Netplan و SSH امن با کلید",
    "عیب‌یابی سیستماتیک با journalctl و شش‌قدم دیباگ",
    "سخت‌سازی سرور با UFW و fail2ban و دفاع عمیق",
  ],
  lessons: [...finalizeLessons(UBUNTU_RICH), ...UBUNTU_COMPACT],
};

/*
  نگاشت شناسه دوره‌های data.ts به محتوای آموزشی
*/
const RAW: Record<string, CourseContent> = {
  py: build(pick("c1"), "py", { after: ["c6"] }),
  dsa: build(pick("c3"), "dsa"),
  algo: build(pick("c4"), "algo"),
  se: build(pick("c5"), "se"),
  react: build(pick("c9"), "react", { before: ["c7", "c8"] }),
  node: build(pick("c10"), "node", { after: ["c16"] }),
  sql: build(pick("c11"), "sql"),
  arch: build(pick("c12"), "arch"),
  test: build(pick("c13"), "test"),
  devops: build(pick("c15"), "devops"),
  ml: build(pick("c17"), "ml"),

  /* دوره «لینوکس، ترمینال و Git از صفر»: لینوکس + Git + درس اسکرام مشترک */
  git: {
    id: "git",
    intro:
      "ترمینال خانه‌ی هر مهندس نرم‌افزار است و Git زبان مشترک همه تیم‌های دنیا. این دوره دو بال پروازت را همزمان می‌سازد: اول لینوکس و خط فرمان — جایی که کامپیوتر واقعاً فرمان می‌برد — بعد Git از اولین commit تا Branch و Pull Request، و در نهایت نگاهی به فرایند تیمی‌ای که این ابزارها را زنده می‌کند.",
    outcomes: [
      "راحت‌شدن کامل با ترمینال و دستورات لینوکس",
      "مدیریت فایل‌ها، مجوزها و Processها از خط فرمان",
      "درک مدل Git: Commit، Branch و Merge",
      "همکاری تیمی با GitHub و Pull Request",
    ],
    lessons: [...(RICH.git ?? []), ...finalizeLessons([
      pick("c2").lessons[0],
      pick("c2").lessons[1],
      pick("c14").lessons[0],
      lesson("se-x1"),
    ]), ...(BULK.git ?? [])],
  },

  java: build(pick("n-java"), "java"),
  cpp: build(pick("n-cpp"), "cpp"),
  os: build(pick("n-os"), "os"),
  dp: build(pick("n-dp"), "dp"),
  net: build(pick("n-net"), "net"),
  vibe: VIBE,
  linux: LINUX,
};

/* ---------- دوره سیستم‌های توزیع‌شده ---------- */
const DIST: CourseContent = {
  id: "dist",
  intro:
    "وقتی یک ماشین دیگر کافی نیست — به‌خاطر مقیاس، دسترس‌پذیری یا فاصله جغرافیایی — وارد دنیای توزیع‌شده می‌شوی؛ دنیایی که در آن شبکه غیرقابل‌اعتماد است، ساعت مشترکی وجود ندارد و خرابی، قاعده است نه استثنا. این دوره از تئوری‌های بنیادی (زمان و ترتیب، اجماع، CAP، Quorum) شروع می‌کند و به ابزارهای واقعی (Raft، Sharding، Saga، Circuit Breaker) و مطالعه موردی سیستم‌های بزرگ (کافکا، کاساندرا، اسپنر) می‌رسد. پیش‌نیاز: آشنایی با ساختمان داده و یک زبان برنامه‌نویسی.",
  outcomes: [
    "درک عمیق چالش‌های ذاتی: شکست جزئی، زمان و ترتیب، ابهام شبکه",
    "فهم اجماع و Raft: انتخاب رهبر، ترم‌ها و تکرار لاگ",
    "تسلط بر Replication، Quorum و مدل‌های سازگاری (CAP/PACELC)",
    "طراحی تقسیم داده با Sharding و هش‌گذاری سازگار",
    "پیاده‌سازی تراکنش توزیع‌شده با Saga و Idempotency",
    "طراحی مقاوم با Timeout، Retry، Circuit Breaker و Bulkhead",
    "خواندن معماری سیستم‌های واقعی و درک مصالحه‌هایشان",
  ],
  lessons: [...DIST_RICH, ...DIST_COMPACT],
};

RAW.dist = DIST;

/* ---------- دوره طراحی و توسعه وب ---------- */
const WEB: CourseContent = {
  id: "web",
  intro:
    "وب بزرگ‌ترین سکوی نرم‌افزاری تاریخ است — و درک عمیقش یعنی فهمیدن هر دو سمت میز: مرورگری که کد را به تصویر تبدیل می‌کند و سروری که داده و منطق را نگه می‌دارد. این دوره از آناتومی بارگذاری صفحه و HTML معنایی شروع می‌شود، با CSS مدرن و ریسپانسیو و جاوااسکریپتِ مرورگر ادامه می‌یابد و به طراحی REST API، معماری لایه‌ای بک‌اند، عملکرد و استراتژی‌های رندر می‌رسد. نه فریم‌ورک‌بازی — مفاهیمی که زیرِ هر فریم‌ورکی ثابت می‌مانند.",
  outcomes: [
    "فهم مسیر رندر بحرانی و بهینه‌سازی بارگذاری صفحه",
    "نوشتن HTML معنایی و دسترس‌پذیر که SEO و صفحه‌خوان‌ها دوستش دارند",
    "تسلط بر Flexbox، Grid و طراحی ریسپانسیو موبایل‌اول",
    "درک DOM، رویدادها و حلقه رویداد مرورگر — زیرِ هر فریم‌ورکی",
    "مدیریت هویت و حالت: Cookie، Session و JWT با نگاه امنیتی",
    "طراحی REST API قابل‌حدس و معماری لایه‌ای بک‌اند",
    "سنجش و بهبود Core Web Vitals و انتخاب استراتژی رندر درست",
  ],
  lessons: [...WEB_RICH, ...WEB_COMPACT],
};

RAW.web = WEB;

/* ---------- دوره دیجیتال مارکتینگ ---------- */
const MKT: CourseContent = {
  id: "mkt",
  intro:
    "دیجیتال مارکتینگ یعنی بازاریابیِ قابل‌اندازه‌گیری: جایی که هر کلیک، هر نمایش و هر خرید عدد دقیق دارد و تصمیم‌ها با داده گرفته می‌شوند نه سلیقه. این دوره از قیف بازاریابی و نقشه راه شروع می‌شود، با سئو، بازاریابی محتوایی و شبکه‌های اجتماعی ادامه می‌یابد و به گوگل ادز، آنالیتیکس، بهینه‌سازی نرخ تبدیل و گروت مارکتینگ می‌رسد — همراه با شبیه‌سازهای تعاملی قیف و A/B Test. چه بخواهی محصول خودت را بفروشی، چه وارد بازار کار بازاریابی شوی، این مسیر کامل است.",
  outcomes: [
    "درک قیف بازاریابی و چیدن کانال‌ها برای هر مرحله",
    "سئو تکنیکال، محتوایی و خارجی + تحقیق کلمات کلیدی دم‌دراز",
    "بازاریابی محتوایی با تقویم و محتوای evergreen",
    "رشد ارگانیک در شبکه‌های اجتماعی و ساخت جامعه",
    "ایمیل مارکتینگ و جریان‌های خودکار (سبد رهاشده، پرورش لید)",
    "راه‌اندازی گوگل ادز با امتیاز کیفیت و محاسبه ROAS",
    "تحلیل داده با آنالیتیکس و بهینه‌سازی قیف و صفحه فرود (CRO)",
    "گروت مارکتینگ با حلقه‌های رشد و آزمایش مداوم",
  ],
  lessons: [...finalizeLessons(MKT_RICH), ...MKT_COMPACT],
};

RAW.mkt = MKT;

export const COURSE_CONTENT: Record<string, CourseContent> = RAW;
