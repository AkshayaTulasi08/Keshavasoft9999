const fs = require('fs');
const path = require('path');

function fixFile(p) {
  if (!fs.existsSync(p)) return false;
  const buf = fs.readFileSync(p);
  // Heuristic: if there are many null bytes, assume UTF-16LE
  const nulls = buf.reduce((c, b) => c + (b === 0 ? 1 : 0), 0);
  let out = null;
  if (nulls > buf.length / 4) {
    out = buf.toString('utf16le');
  } else {
    out = buf.toString('utf8');
  }
  // strip BOMs and leading garbage before first '<'
  out = out.replace(/^\uFEFF+/, '');
  const firstLt = out.indexOf('<');
  if (firstLt > 0) out = out.slice(firstLt);
  fs.writeFileSync(p, out, 'utf8');
  return true;
}

const root = path.join(__dirname, '..');
const targets = [
  path.join(root, 'src', 'index.html'),
  path.join(root, 'dist', 'index.html')
];

for (const t of targets) {
  if (fixFile(t)) console.log('Fixed encoding:', t);
  else console.log('Not found (skipped):', t);
}

console.log('ensure-utf8 done.');
