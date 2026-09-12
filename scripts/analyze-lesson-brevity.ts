import type { Lesson, Block } from "../src/lib/content-types";
import { COURSE_CONTENT } from "../src/lib/content-index";
import { DEEP_A } from "../src/lib/deepdive1";
import { DEEP_B } from "../src/lib/deepdive2";
import { DEEP_C } from "../src/lib/deepdive3";
import { DEEP_D } from "../src/lib/deepdive4";
import { DEEP_E } from "../src/lib/deepdive5";
import { DEEP_F } from "../src/lib/deepdive6";
const DEEP: Record<string, Block[]> = { ...DEEP_A, ...DEEP_B, ...DEEP_C, ...DEEP_D, ...DEEP_E, ...DEEP_F };

interface LessonMetrics {
  id: string;
  title: string;
  courseId: string;
  proseChars: number;
  totalChars: number;
  sections: number;
  quizCount: number;
  hasCode: boolean;
  hasTable: boolean;
  hasTip: boolean;
  hasWarn: boolean;
  hasDef: boolean;
  hasVisual: boolean;
  hasList: boolean;
  hasDeep: boolean;
  hasInjectedVisual: boolean;
  blockCount: number;
}

function countProse(block: Block): number {
  switch (block.k) {
    case "p":
    case "h":
      return block.t.length;
    case "list":
      return block.items.reduce((sum, s) => sum + s.length, 0);
    case "def":
      return block.term.length + block.t.length;
    case "tip":
    case "warn":
      return block.t.length;
    case "table":
      return block.head.reduce((s, h) => s + h.length, 0) + block.rows.reduce((s, row) => s + row.reduce((r, c) => r + c.length, 0), 0);
    default:
      return 0;
  }
}

function countTotal(block: Block): number {
  switch (block.k) {
    case "p":
    case "h":
      return block.t.length;
    case "list":
      return block.items.reduce((sum, s) => sum + s.length, 0);
    case "code":
      return (block.title ?? "").length + block.code.length;
    case "tip":
    case "warn":
    case "def":
      return (block.title ?? "").length + (block.k === "def" ? block.term.length + block.t.length : block.t.length);
    case "table":
      return block.head.reduce((s, h) => s + h.length, 0) + block.rows.reduce((s, row) => s + row.reduce((r, c) => r + c.length, 0), 0);
    case "visual":
      return (block.title ?? "").length + block.visual.length;
    default:
      return 0;
  }
}

function analyzeLesson(lesson: Lesson, courseId: string): LessonMetrics {
  return {
    id: lesson.id,
    title: lesson.title,
    courseId,
    proseChars: lesson.blocks.reduce((sum, b) => sum + countProse(b), 0),
    totalChars: lesson.blocks.reduce((sum, b) => sum + countTotal(b), 0),
    sections: lesson.blocks.filter((b) => b.k === "h").length,
    quizCount: lesson.quiz.length,
    hasCode: lesson.blocks.some((b) => b.k === "code"),
    hasTable: lesson.blocks.some((b) => b.k === "table"),
    hasTip: lesson.blocks.some((b) => b.k === "tip"),
    hasWarn: lesson.blocks.some((b) => b.k === "warn"),
    hasDef: lesson.blocks.some((b) => b.k === "def"),
    hasVisual: lesson.blocks.some((b) => b.k === "visual"),
    hasList: lesson.blocks.some((b) => b.k === "list"),
    hasDeep: !!DEEP[lesson.id],
    hasInjectedVisual: false,
    blockCount: lesson.blocks.length,
  };
}

const ALL: LessonMetrics[] = [];
for (const [courseId, content] of Object.entries(COURSE_CONTENT)) {
  for (const lesson of content.lessons) {
    ALL.push(analyzeLesson(lesson, courseId));
  }
}

// Per-course breakdown
console.log("--- Per-course breakdown ---");
const courseGroups = new Map<string, LessonMetrics[]>();
for (const m of ALL) {
  if (!courseGroups.has(m.courseId)) courseGroups.set(m.courseId, []);
  courseGroups.get(m.courseId)!.push(m);
}

for (const [courseId, lessons] of courseGroups) {
  const avgProse = Math.round(lessons.reduce((s, l) => s + l.proseChars, 0) / lessons.length);
  const avgTotal = Math.round(lessons.reduce((s, l) => s + l.totalChars, 0) / lessons.length);
  const shortest = lessons.reduce((a, b) => (a.proseChars < b.proseChars ? a : b));
  console.log(
    `[${courseId}] ${lessons.length} lessons | avg prose: ${avgProse}, avg total: ${avgTotal} | shortest: ${shortest.id} (${shortest.proseChars} prose, ${shortest.sections} secs, quiz: ${shortest.quizCount})`
  );
}

// Lessons flagged as too brief by a relaxed scoring
console.log("\n--- Relaxed 'too brief' scoring ---");
console.log("Scoring: -1 point for each of: prose<600, total<1200, sections<2, quiz<=1, no code, no table, no tip, no warn, no def");
console.log("Threshold: score >= 5 (flagged for review)\n");

const flagged = ALL.map((m) => {
  let score = 0;
  if (m.proseChars < 600) score++;
  if (m.totalChars < 1200) score++;
  if (m.sections < 2) score++;
  if (m.quizCount <= 1) score++;
  if (!m.hasCode) score++;
  if (!m.hasTable) score++;
  if (!m.hasTip) score++;
  if (!m.hasWarn) score++;
  if (!m.hasDef) score++;

  return { ...m, score };
}).filter((m) => m.score >= 5);

flagged.sort((a, b) => b.score - a.score);

for (const m of flagged) {
  const flags: string[] = [];
  if (m.proseChars < 600) flags.push(`prose<600(${m.proseChars})`);
  if (m.totalChars < 1200) flags.push(`total<1200(${m.totalChars})`);
  if (m.sections < 2) flags.push(`secs<2(${m.sections})`);
  if (m.quizCount <= 1) flags.push(`quiz<=1(${m.quizCount})`);
  if (!m.hasCode) flags.push("noCode");
  if (!m.hasTable) flags.push("noTable");
  if (!m.hasTip) flags.push("noTip");
  if (!m.hasWarn) flags.push("noWarn");
  if (!m.hasDef) flags.push("noDef");
  const deep = m.hasDeep ? "+deep" : "noDeep";
  const vis = m.hasInjectedVisual ? "+viz" : "noViz";
  console.log(
    `score:${m.score} ${m.id} (prose:${m.proseChars}, total:${m.totalChars}, secs:${m.sections}, quiz:${m.quizCount}, blocks:${m.blockCount}) ` +
      `[${flags.join(", ")}] ${deep} ${vis} — "${m.title}" — [${m.courseId}]`
  );
}
