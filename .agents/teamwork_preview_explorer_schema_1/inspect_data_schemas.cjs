const fs = require('fs');
const path = require('path');

// Read src/utils/mockData.js
const mockDataContent = fs.readFileSync(path.resolve(__dirname, '../../src/utils/mockData.js'), 'utf8');
const liveDataContent = fs.readFileSync(path.resolve(__dirname, '../../src/utils/liveData.js'), 'utf8');
const innerPagesContent = fs.readFileSync(path.resolve(__dirname, '../../src/utils/innerPagesData.js'), 'utf8');
const universityContent = fs.readFileSync(path.resolve(__dirname, '../../src/utils/universityData.js'), 'utf8');
const appStoreContent = fs.readFileSync(path.resolve(__dirname, '../../src/store/useAppStore.js'), 'utf8');

console.log("=== mockData exports & structures ===");
// Extract exported arrays/functions from mockData
const mockExports = mockDataContent.match(/export\ (?:const|var|let|function)\ ([a-zA-Z0-9_$]+)/g);
console.log(mockExports);

console.log("\n=== liveData exports & structures ===");
const liveExports = liveDataContent.match(/export\ (?:const|var|let|function)\ ([a-zA-Z0-9_$]+)/g);
console.log(liveExports);

console.log("\n=== innerPages exports & structures ===");
const innerExports = innerPagesContent.match(/export\ (?:const|var|let|function)\ ([a-zA-Z0-9_$]+)/g);
console.log(innerExports);

console.log("\n=== universityData exports & structures ===");
const uniExports = universityContent.match(/export\ (?:const|var|let|function)\ ([a-zA-Z0-9_$]+)/g);
console.log(uniExports);
