const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '../src/lib');

function escapeJson(obj) {
  return JSON.stringify(obj).replace(/'/g, "''");
}

function extractLessonsFromContent(content, courseId) {
  const lessons = [];
  const lines = content.split('\n');

  let currentLesson = null;
  let inLessonsArray = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('lessons:')) {
      inLessonsArray = true;
      braceCount = 0;
    }

    if (inLessonsArray) {
      for (const ch of line) {
        if (ch === '[' || ch === '{') braceCount++;
        if (ch === ']' || ch === '}') braceCount--;
      }

      const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
      const titleMatch = line.match(/title:\s*['"]([^'"]+)['"]/);

      if (idMatch && titleMatch && braceCount > 0) {
        currentLesson = { id: idMatch[1], title: titleMatch[1] };
      }

      if (braceCount <= 0) {
        inLessonsArray = false;
      }
    }
  }

  return lessons;
}

function parseLessonBlocks(content) {
  const blocks = [];
  const blockRegex = /\{\s*k:\s*['"](\w+)['"][^}]*\}/g;
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    try {
      const blockStr = match[0].replace(/(\w+):/g, '"$1":');
      const block = JSON.parse(blockStr);
      blocks.push(block);
    } catch (e) {}
  }

  return blocks;
}

function generateInsertStatement(lessons, courseId) {
  if (lessons.length === 0) return '';

  const values = lessons.map((l, idx) => {
    const blocks = escapeJson(l.blocks || []);
    const quiz = escapeJson(l.quiz || []);
    const minutes = l.minutes || 30;

    return `('${l.id}', '${courseId}', '${l.title.replace(/'/g, "''")}', ${minutes}, ${idx + 1}, '${blocks}'::jsonb, '${quiz}'::jsonb)`;
  });

  return `INSERT INTO lessons (id, course_id, title, minutes, sort_order, blocks, quiz) VALUES\n${values.join(',\n')}\nON CONFLICT (id) DO NOTHING;`;
}

const content = fs.readFileSync(path.join(libDir, 'content1.ts'), 'utf8');
const lessons = extractLessonsFromContent(content, 'py');
console.log(`Found ${lessons.length} lessons`);
console.log(generateInsertStatement(lessons, 'py'));
