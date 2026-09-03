const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');
const customIndex = fs.readFileSync(path.join(docsDir, '_includes/lunr/custom-index.js'), 'utf8');

function defaultLunrTrim(value) {
  return value.replace(/^\W+/, '').replace(/\W+$/, '');
}

function cpTplUnicodeTrim(value) {
  return value
    .replace(/^[^0-9A-Za-z\u0400-\u04FF]+/, '')
    .replace(/[^0-9A-Za-z\u0400-\u04FF]+$/, '');
}

const failures = [];

if (defaultLunrTrim('бегущая') !== '') {
  failures.push('Expected Lunr default trimmer reproduction to drop Cyrillic token.');
}

if (cpTplUnicodeTrim('«бегущая»') !== 'бегущая') {
  failures.push('Unicode trimmer does not preserve Cyrillic token.');
}

if (!customIndex.includes('\\u0400-\\u04FF')) {
  failures.push('custom-index.js is missing Cyrillic-aware trimmer.');
}

for (const name of fs.readdirSync(docsDir).filter((name) => name.endsWith('.md'))) {
  const file = path.join(docsDir, name);
  const source = fs.readFileSync(file, 'utf8');
  const frontMatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) continue;

  const frontMatter = frontMatterMatch[1];
  const aliasesStart = frontMatter.indexOf('\nsearch_aliases:\n');
  if (aliasesStart === -1) continue;

  const aliasBlock = frontMatter.slice(aliasesStart + '\nsearch_aliases:\n'.length);
  const keys = [];
  for (const line of aliasBlock.split('\n')) {
    if (/^[A-Za-z_]/.test(line)) break;
    const match = line.match(/^  ([a-z0-9-]+):(?:\s|$)/i);
    if (match) keys.push(match[1]);
  }

  for (const key of keys) {
    if (!source.includes(`{#${key}}`)) {
      failures.push(`${name}: search_aliases key "${key}" has no matching {#${key}} anchor.`);
    }
  }
}

const ui = fs.readFileSync(path.join(docsDir, '07-ui-helpers.md'), 'utf8');
if (!/marquee:[\s\S]*бегущая строка/.test(ui)) {
  failures.push('07-ui-helpers.md: marquee alias must include "бегущая строка".');
}

if (failures.length) {
  console.error('Docs search checks failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Docs search checks passed. Cyrillic tokens and section aliases look valid.');
