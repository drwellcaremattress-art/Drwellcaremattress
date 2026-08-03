import { PRODUCT_CATALOG } from './src/lib/catalog.js';
const match = PRODUCT_CATALOG.filter(p => JSON.stringify(p).toLowerCase().includes('bond'));
console.log("Matches:", match.map(m => m.name));
