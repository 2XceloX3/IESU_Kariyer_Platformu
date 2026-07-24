const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

// 1. Read Data Files
const dataFiles = [
  'src/utils/mockData.js',
  'src/utils/liveData.js',
  'src/utils/innerPagesData.js',
  'src/utils/universityData.js',
  'src/components/liveData.js',
  'src/data/mockAdminData.js',
  'src/data/knowledge_base/announcements_media.json',
  'src/data/knowledge_base/corporate_hierarchy.json',
  'src/data/knowledge_base/documents_forms.json',
  'src/data/knowledge_base/route_map.json',
  'src/data/knowledge_base/units_services.json'
];

const dataFileAnalysis = {};

dataFiles.forEach(relPath => {
  const fullPath = path.resolve(__dirname, '../../', relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Extract exported keys if js
    const exports = [];
    const exportMatches = content.matchAll(/export\ (?:const|var|let|function)\ ([a-zA-Z0-9_$]+)/g);
    for (const match of exportMatches) {
      exports.push(match[1]);
    }
    dataFileAnalysis[relPath] = {
      exists: true,
      exports: exports,
      lineCount: content.split('\n').length
    };
  } else {
    dataFileAnalysis[relPath] = { exists: false };
  }
});

console.log('Data File Analysis:', JSON.stringify(dataFileAnalysis, null, 2));

// Save analysis summary
fs.writeFileSync(path.join(__dirname, 'data_files_summary.json'), JSON.stringify(dataFileAnalysis, null, 2));
