import fs from 'fs';
import path from 'path';

const catalogPath = path.join(process.cwd(), 'src', 'lib', 'catalog.ts');
let content = fs.readFileSync(catalogPath, 'utf8');

const FIRMNESS_UPDATES = [
  // Soft
  { match: /memory-dump/i, firmness: 'Soft' },
  { match: /luxoria/i, firmness: 'Soft' },
  
  // Medium Soft
  { match: /lax-o-bond/i, firmness: 'Medium Soft' },
  { match: /memory-bond/i, firmness: 'Medium Soft' },
  { match: /natural-latex/i, firmness: 'Medium Soft' },

  // Medium Firm
  { match: /ecolatex/i, firmness: 'Medium Firm' },
  { match: /softy-bond/i, firmness: 'Medium Firm' },
  { match: /mona-softy/i, firmness: 'Medium Firm' },

  // Firm
  { match: /mona-lite/i, firmness: 'Firm' }
];

// Instead of regex on the whole file, we can replace firmness in catalog
let inProduct = false;
let currentSlug = '';
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('slug:')) {
    const match = line.match(/slug:\s*'([^']+)'/);
    if (match) currentSlug = match[1];
  }
  
  if (line.includes('firmness:') && currentSlug) {
    for (const update of FIRMNESS_UPDATES) {
      if (update.match.test(currentSlug)) {
        lines[i] = `    firmness: '${update.firmness}',`;
        break;
      }
    }
  }
}

fs.writeFileSync(catalogPath, lines.join('\n'));
console.log('Updated firmness in catalog.ts');
