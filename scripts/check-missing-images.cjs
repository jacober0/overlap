const fs = require('fs');
const path = require('path');

// Collect all appIds from editorialRecipes.ts and batch files
const dataDir = 'src/data';
const files = ['editorialRecipes.ts', ...fs.readdirSync(dataDir).filter(f => /editorialRecipesBatch\d+\.ts$/.test(f))];
const ids = new Set();
for (const f of files) {
  const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const m = src.match(/appId:\s*'([^']+)'/g) || [];
  for (const x of m) ids.add(x.replace(/appId:\s*'([^']+)'/, '$1'));
  const m2 = src.match(/common\('([^']+)'\)/g) || [];
  for (const x of m2) ids.add(x.replace(/common\('([^']+)'\)/, '$1'));
}
console.log('total appIds found:', ids.size);

// Collect generated image ids
const genSrc = fs.readFileSync('src/data/generatedRecipeImageIds.ts', 'utf8');
const genIds = new Set([...genSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
console.log('generated image ids:', genIds.size);

// Actual image files present
const imgFiles = new Set(fs.readdirSync('public/recipes').map(f => f.replace(/\.jpg$/, '')));
console.log('image files present:', imgFiles.size);

// Missing: appIds that have no generated id AND no image file
const missing = [...ids].filter(id => !genIds.has(id) && !imgFiles.has(id));
console.log('MISSING images (no gen id, no file):', missing.length);
console.log(missing.join('\n'));
