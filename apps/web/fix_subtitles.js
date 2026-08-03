const fs = require('fs');
let f = fs.readFileSync('src/lib/catalog.ts', 'utf-8');
f = f.replace(/subtitle: '(.*?) - \d+ Inch'/g, "subtitle: '$1'");
fs.writeFileSync('src/lib/catalog.ts', f);
