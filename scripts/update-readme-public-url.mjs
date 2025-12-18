#!/usr/bin/env node
// update-readme-public-url.mjs
// Reads docs/last-public-url.txt and replaces the <!-- PUBLIC_URL --> token in README.md with a markdown link.

import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const docsFile = path.join(repoRoot, 'docs', 'last-public-url.txt');
const readmeFile = path.join(repoRoot, 'README.md');

function readUrl() {
  try {
    const txt = fs.readFileSync(docsFile, 'utf8').trim();
    if (!txt) return null;
    return txt;
  } catch (e) {
    return null;
  }
}

function updateReadme(url) {
  if (!fs.existsSync(readmeFile)) {
    console.error('README.md not found');
    process.exit(2);
  }
  const md = fs.readFileSync(readmeFile, 'utf8');
  const token = '<!-- PUBLIC_URL -->';
  let replacement = token;
  if (url) {
    replacement = `[${url}](${url})`;
  }
  if (md.includes(token)) {
    const updated = md.replace(token, replacement);
    fs.writeFileSync(readmeFile, updated, 'utf8');
    console.log('README.md updated with public URL');
    return true;
  } else {
    console.error('Token not found in README.md');
    return false;
  }
}

const url = readUrl();
if (!url) {
  console.log('No public URL found in docs/last-public-url.txt. README not updated.');
  process.exit(0);
}

updateReadme(url);

