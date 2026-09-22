const fs = require('fs');
const patch = fs.readFileSync('bolt-care-basket-selection.patch', 'utf8').replace(/\r/g, '');
const updates = [];
for (const block of patch.split('diff --git ').slice(1)) {
  const lines = block.split('\n');
  const file = lines.find(line => line.startsWith('+++ b/')).slice(6);
  if (!file.startsWith('src/')) throw Error('Unexpected path');
  const exists = fs.existsSync(file);
  const src = exists ? fs.readFileSync(file, 'utf8').replace(/\r/g, '').split('\n') : [];
  const out = [];
  let cursor = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('@@ ')) continue;
    const start = Math.max(0, parseInt(lines[i].split(' ')[1].slice(1)) - 1);
    out.push(...src.slice(cursor, start));
    cursor = start;
    for (i++; i < lines.length && !lines[i].startsWith('@@'); i++) {
      const line = lines[i];
      if (line.startsWith(' ') || line.startsWith('-')) {
        if (src[cursor] !== line.slice(1)) throw Error(`Context mismatch ${file}:${cursor + 1}`);
        if (line[0] === ' ') out.push(src[cursor]);
        cursor++;
      } else if (line.startsWith('+')) out.push(line.slice(1));
    }
    i--;
  }
  if (exists) out.push(...src.slice(cursor));
  else out.push('');
  updates.push([file, out.join('\n')]);
}
for (const [file, content] of updates) {
  fs.mkdirSync(require('path').dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`Applied ${file}`);
}
