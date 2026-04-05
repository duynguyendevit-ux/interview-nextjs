#!/usr/bin/env node
// Quick tool to generate SQL INSERT statements for pending_questions

const fs = require('fs');
const { randomUUID } = require('crypto');

const USAGE = `
Usage: node generate-sql.js <input-file> <topic> <level> [submitted-by]

Input format (markdown or text):
  Q: Question text here?
  A: Answer text here.
  
  Q: Another question?
  A: Another answer.

Example:
  node generate-sql.js spring-boot-questions.txt spring-boot intermediate
  node generate-sql.js oracle-advanced.md oracle advanced "admin@example.com"

Levels: beginner, intermediate, advanced
Default submitted_by: bulk-import
`;

if (process.argv.length < 5) {
  console.log(USAGE);
  process.exit(1);
}

const inputFile = process.argv[2];
const topic = process.argv[3];
const level = process.argv[4];
const submittedBy = process.argv[5] || 'bulk-import';

if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
  console.error('Error: Level must be beginner, intermediate, or advanced');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File ${inputFile} not found`);
  process.exit(1);
}

const content = fs.readFileSync(inputFile, 'utf8');

// Parse Q&A pairs
const lines = content.split('\n');
const questions = [];
let currentQ = null;
let currentA = null;

for (const line of lines) {
  const trimmed = line.trim();
  
  if (trimmed.startsWith('Q:') || trimmed.startsWith('### Q')) {
    if (currentQ && currentA) {
      questions.push({ question: currentQ, answer: currentA });
    }
    currentQ = trimmed.replace(/^(Q:|### Q\d+:)\s*/, '').trim();
    currentA = null;
  } else if (trimmed.startsWith('A:')) {
    currentA = trimmed.replace(/^A:\s*/, '').trim();
  } else if (currentA && trimmed) {
    currentA += ' ' + trimmed;
  }
}

// Add last pair
if (currentQ && currentA) {
  questions.push({ question: currentQ, answer: currentA });
}

if (questions.length === 0) {
  console.error('Error: No Q&A pairs found in input file');
  console.log('\nExpected format:');
  console.log('Q: Question text?');
  console.log('A: Answer text.');
  process.exit(1);
}

// Generate SQL for pending_questions
const escapeSql = (str) => str.replace(/'/g, "''");

console.log(`-- Generated from ${inputFile}`);
console.log(`-- Topic: ${topic}, Level: ${level}`);
console.log(`-- Submitted by: ${submittedBy}`);
console.log(`-- Total questions: ${questions.length}`);
console.log(`-- Status: pending (requires admin approval)\n`);

console.log(`INSERT INTO pending_questions (id, topic, text, answer, level, submitted_by, submitted_at, status) VALUES`);

questions.forEach((qa, index) => {
  const isLast = index === questions.length - 1;
  const id = randomUUID();
  const question = escapeSql(qa.question);
  const answer = escapeSql(qa.answer);
  
  console.log(`('${id}', '${topic}', '${question}', '${answer}', '${level}', '${submittedBy}', datetime('now'), 'pending')${isLast ? ';' : ','}`);
});

console.log(`\n-- ${questions.length} questions generated (pending approval)`);
console.error(`\n✅ Generated ${questions.length} SQL INSERT statements`);
console.error(`⏳ Status: pending (admin must approve at /admin)`);
console.error(`📝 Output saved to stdout (redirect to file: > output.sql)`);
