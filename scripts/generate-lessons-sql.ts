import { COURSE_CONTENT } from '../src/lib/content-index';

function escapeJson(obj: unknown): string {
  return JSON.stringify(obj).replace(/'/g, "''");
}

function generateInsertStatements(): string {
  const statements: string[] = [];
  const allLessons: Array<{ id: string; courseId: string; title: string; minutes: number; sortOrder: number; blocks: unknown; quiz: unknown }> = [];

  for (const [courseId, content] of Object.entries(COURSE_CONTENT)) {
    content.lessons.forEach((lesson, idx) => {
      allLessons.push({
        id: lesson.id,
        courseId: courseId,
        title: lesson.title,
        minutes: lesson.minutes,
        sortOrder: idx + 1,
        blocks: lesson.blocks,
        quiz: lesson.quiz,
      });
    });
  }

  const batchSize = 10;
  for (let i = 0; i < allLessons.length; i += batchSize) {
    const batch = allLessons.slice(i, i + batchSize);
    const values = batch.map(l =>
      `('${l.id}', '${l.courseId}', '${l.title}', ${l.minutes}, ${l.sortOrder}, '${escapeJson(l.blocks)}'::jsonb, '${escapeJson(l.quiz)}'::jsonb)`
    );
    statements.push(`INSERT INTO lessons (id, course_id, title, minutes, sort_order, blocks, quiz) VALUES\n${values.join(',\n')}\nON CONFLICT (id) DO NOTHING;`);
  }

  return statements.join('\n\n');
}

console.log('-- =============================================');
console.log('-- Bitcode Academy - All Lessons Migration');
console.log('-- Generated automatically from src/lib content files');
console.log('-- =============================================');
console.log('');
console.log(generateInsertStatements());
