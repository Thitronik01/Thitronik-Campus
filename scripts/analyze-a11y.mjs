import fs from 'fs';
import { execSync } from 'child_process';

const eslintCmd = 'npx eslint "src/**/*.{ts,tsx}" --format json -o eslint_report.json';
try {
  execSync(eslintCmd, { stdio: 'ignore' });
} catch (e) {} // Exits 1 on error

const report = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));
const a11yIssues = [];

report.forEach(file => {
  const issues = file.messages.filter(msg => msg.ruleId && msg.ruleId.startsWith('jsx-a11y'));
  if (issues.length > 0) {
    a11yIssues.push({
      file: file.filePath.replace(process.cwd(), ''),
      issues: issues.map(i => `L${i.line}:${i.column} - [${i.ruleId}] ${i.message}`)
    });
  }
});

fs.writeFileSync('a11y_summary.json', JSON.stringify(a11yIssues, null, 2));
const total = a11yIssues.reduce((acc, f) => acc + f.issues.length, 0);
console.log(`Found ${total} a11y issues across ${a11yIssues.length} files.`);
