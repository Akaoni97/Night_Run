// Estetica premium: ogni icona usata in premium.css esiste in premium.js e diventa una maschera valida.
'use strict';
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(R, 'premium.js'), 'utf8'), css = fs.readFileSync(path.join(R, 'premium.css'), 'utf8');
const P = new Function(src + ';return { PI, piUrl, piCss, piDoc }')();

test('ogni var(--pi-...) del CSS ha la sua icona', () => {
  const usate = [...new Set([...css.matchAll(/--pi-([a-zA-Z]+)/g)].map((m) => m[1]))].filter((n) => n !== 'place');
  for (const n of usate) assert.ok(P.PI[n], 'manca l\'icona ' + n);
});
test('le icone sono svg ben chiusi e diventano url codificati', () => {
  for (const n of Object.keys(P.PI)) {
    const d = P.piDoc(n);
    assert.ok(d.startsWith('<svg') && d.endsWith('</svg>'), n);
    assert.strictEqual((d.match(/<(path|circle|rect)\b/g) || []).length, (d.match(/\/>/g) || []).length, 'elemento non chiuso in ' + n);
    assert.ok(!/class=/.test(d), 'classe rimasta in ' + n);
    assert.ok(!/[<>#"]/.test(P.piUrl(n).slice(5, -2).replace(/^"|"$/g, '')), 'url non codificato in ' + n);
  }
  assert.ok(P.piCss().includes('--p-emblem:'));
});
test('tutte le regole del CSS stanno sotto :root:not(.classico) (o sono keyframes)', () => {
  const sel = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[^{]+\{([^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
    .replace(/@media[^{]+\{/g, '').match(/[^{}]+(?=\{)/g).map((s) => s.trim()).filter(Boolean);
  for (const s of sel) for (const part of s.split(',')) assert.ok(/^:root[.:]/.test(part.trim()), 'regola fuori dal premium: ' + part.trim());
});
