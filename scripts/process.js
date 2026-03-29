const fs = require('fs');
const svg = fs.readFileSync('src/assets/aura.svg', 'utf8');
const paths = svg.match(/<path[^>]+>/g);
console.log("Total paths:", paths.length);
console.log("First 20 paths:", paths.slice(0, 20).map(p => p.substring(0, 80)));
