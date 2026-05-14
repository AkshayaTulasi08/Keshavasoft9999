const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.log('dist directory not found, skipping encoding fixes.');
  process.exit(0);
}

for (const name of fs.readdirSync(distDir)) {
  if (!name.endsWith('.html')) continue;
  const filePath = path.join(distDir, name);
  const buf = fs.readFileSync(filePath);
  let utf8 = buf.toString('utf8');
  // remove utf8 BOM if present and strip any leading garbage before '<'
  utf8 = utf8.replace(/^\uFEFF+/, '');
  if (utf8.indexOf('\u0000') !== -1 || utf8.indexOf('<') === -1) {
    let decoded = buf.toString('utf16le');
    // strip any BOM from decoded utf16le
    decoded = decoded.replace(/^\uFEFF+/, '');
    const firstLt = decoded.indexOf('<');
    if (firstLt > 0) decoded = decoded.slice(firstLt);
    fs.writeFileSync(filePath, decoded, 'utf8');
    console.log(`Re-encoded ${name} to utf8`);
  } else {
    // if utf8 contains leading garbage characters before '<', strip them
    const firstLt = utf8.indexOf('<');
    if (firstLt > 0) {
      const fixed = utf8.slice(firstLt);
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Stripped leading garbage from ${name}`);
    }
  }
}
console.log('Encoding fixes complete.');
