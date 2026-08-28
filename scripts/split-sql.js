const fs = require('fs');
const path = require('path');

const sqlContent = fs.readFileSync(path.join(__dirname, '../supabase/seed/003_all_lessons.sql'), 'utf8');
const chunksDir = path.join(__dirname, '../supabase/seed/chunks');

const statements = sqlContent.split(/;\s*INSERT INTO lessons/);
const header = statements[0];

let currentChunk = header;
let chunkIndex = 1;
let statementCount = 0;
const maxStatementsPerChunk = 5;

for (let i = 1; i < statements.length; i++) {
  const stmt = 'INSERT INTO lessons' + statements[i];
  currentChunk += stmt;
  statementCount++;

  if (statementCount >= maxStatementsPerChunk || i === statements.length - 1) {
    const chunkFile = path.join(chunksDir, `lessons_chunk_${String(chunkIndex).padStart(2, '0')}.sql`);
    fs.writeFileSync(chunkFile, currentChunk.trim() + ';\n');
    console.log(`Created ${chunkFile} with ${statementCount} statements`);
    currentChunk = header;
    chunkIndex++;
    statementCount = 0;
  }
}

console.log(`\nTotal chunks created: ${chunkIndex - 1}`);
