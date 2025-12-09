import fs from 'fs';
import path from 'path';

const root = path.resolve('client/src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

function walk(dir, files=[]) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const res = path.join(dir, it.name);
    if (it.isDirectory()) walk(res, files);
    else if (exts.includes(path.extname(it.name))) files.push(res);
  }
  return files;
}

function findIssues(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const hooks = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useReducer'];
  const issues = [];
  for (let i = 0; i < lines.length; i++) {
    for (const hook of hooks) {
      if (lines[i].includes(hook + '(')) {
        // check a few previous lines for conditional statements
        const lookBack = 6;
        let conditional = false;
        for (let j = Math.max(0, i - lookBack); j < i; j++) {
          const l = lines[j].trim();
          if (!l) continue;
          // ignore comments
          if (l.startsWith('//') || l.startsWith('/*') || l.startsWith('*')) continue;
          // if line begins with 'if (' or 'if(' or 'else if' or '?:' or starts with 'return' that may early-exit
          if (/^if\s*\(|^else\s+if\s*\(|\?\s*/.test(l) || /^return\b/.test(l)) { conditional = true; break; }
          // break if we hit a function or component start (to avoid false positives)
          if (/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*\{/.test(l)) break;
        }
        if (conditional) {
          issues.push({ line: i + 1, hook, code: lines[i].trim() });
        }
      }
    }
  }
  return issues;
}

const files = walk(root);
const results = {};
for (const f of files) {
  const issues = findIssues(f);
  if (issues.length) results[f] = issues;
}

console.log(JSON.stringify(results, null, 2));

