export type Block =
  | { k: 'p'; t: string }
  | { k: 'h'; t: string }
  | { k: 'list'; items: string[] }
  | { k: 'code'; lang: string; title?: string; code: string }
  | { k: 'tip'; title: string; t: string }
  | { k: 'warn'; title: string; t: string }
  | { k: 'def'; term: string; t: string }
  | { k: 'table'; head: string[]; rows: string[][] }
  | { k: 'visual'; visual: string; title: string };

export interface Quiz {
  q: string;
  opts: string[];
  ans: number;
  why: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  blocks: Block[];
  quiz: Quiz[];
}

export interface CourseContent {
  id: string;
  intro: string;
  outcomes: string[];
  lessons: Lesson[];
}
