#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const helpers = fs.readFileSync(path.join(root, 'helpers.js'), 'utf8');
const terms = fs.readFileSync(path.join(root, 'terms.js'), 'utf8');
const docsDir = path.join(root, 'docs');
const docFiles = fs.readdirSync(docsDir)
  .filter((name) => name.endsWith('.md'))
  .map((name) => ({
    name,
    text: fs.readFileSync(path.join(docsDir, name), 'utf8')
  }));

const publicApi = new Set();
const helperDeclaredFunctions = new Set(
  [...helpers.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1])
);
const termsDeclaredFunctions = new Set(
  [...terms.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1])
);

for (const match of helpers.matchAll(/(?:window\.cp_tpl|cp)((?:\.[A-Za-z0-9_]+)+)\s*=\s*function\b/g)) {
  publicApi.add('window.cp_tpl' + match[1]);
}

for (const match of helpers.matchAll(/cp((?:\.[A-Za-z0-9_]+)+)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g)) {
  if (helperDeclaredFunctions.has(match[2])) {
    publicApi.add('window.cp_tpl' + match[1]);
  }
}

for (const match of helpers.matchAll(/window\.([A-Za-z0-9_]+)\s*=\s*function\b/g)) {
  if (match[1] !== 't396_onSuccess') {
    publicApi.add('window.' + match[1]);
  }
}
for (const match of helpers.matchAll(/window\.([A-Za-z0-9_]+)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g)) {
  if (helperDeclaredFunctions.has(match[2]) && match[1] !== 't396_onSuccess') {
    publicApi.add('window.' + match[1]);
  }
}

if (/^function\s+waitForZoneJs\s*\(/m.test(helpers)) {
  publicApi.add('waitForZoneJs');
}

for (const match of terms.matchAll(/window\.([A-Za-z0-9_]+)\s*=\s*function\b/g)) {
  publicApi.add('window.' + match[1]);
}
for (const match of terms.matchAll(/window\.([A-Za-z0-9_]+)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g)) {
  if (termsDeclaredFunctions.has(match[2])) {
    publicApi.add('window.' + match[1]);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findDetailedSection(apiName) {
  const escaped = escapeRegExp(apiName);
  const headingRe = new RegExp('^## `'+ escaped + '(?:\\([^\\n`]*\\))?`[^\\n]*$', 'm');

  for (const file of docFiles) {
    const match = headingRe.exec(file.text);
    if (!match) continue;

    const start = match.index;
    const afterHeading = start + match[0].length;
    const rest = file.text.slice(afterHeading);
    const nextLevel2 = /^##\s+/m.exec(rest);
    const end = nextLevel2 ? afterHeading + nextLevel2.index : file.text.length;

    return {
      file: file.name,
      text: file.text.slice(start, end)
    };
  }

  return null;
}

const errors = [];

for (const apiName of [...publicApi].sort()) {
  const section = findDetailedSection(apiName);

  if (!section) {
    errors.push(`${apiName}: no dedicated level-2 section`);
    continue;
  }

  if (!section.text.includes('### Стандартный вызов')) {
    errors.push(`${apiName}: missing "Стандартный вызов" in ${section.file}`);
  }

  if (!section.text.includes('### Полный вызов')) {
    errors.push(`${apiName}: missing "Полный вызов" in ${section.file}`);
  }
}

const returnedMethodSections = [
  'hidden.apply()',
  'hidden.destroy()',
  'utm.buildUtmMarks(extra, buildConfig)',
  'selection.getFormIds()',
  'selection.scan()',
  'selection.finish(reason)',
  'hit.get()',
  'hit.refresh()',
  'order.createFormSnapshot(form)',
  'order.buildPayload(formOrSnapshot, globalMeta)',
  'order.send(formOrSnapshot)',
  'spacer.fit()',
  'switcher.activate(index)'
];

const allDocs = docFiles.map((file) => file.text).join('\n');
for (const method of returnedMethodSections) {
  if (!allDocs.includes('`' + method + '`')) {
    errors.push(`returned method missing detailed mention: ${method}`);
  }
}

if (errors.length) {
  console.error('Documentation coverage check failed:');
  errors.forEach((error) => console.error(' - ' + error));
  process.exit(1);
}

console.log(`OK: ${publicApi.size} public functions have dedicated standard/full-call sections.`);
console.log(`OK: ${returnedMethodSections.length} returned API methods are documented.`);
