const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function getAllJsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsxFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllJsxFiles(srcDir);

const componentAudits = [];

allFiles.forEach(filePath => {
  const relPath = path.relative(path.resolve(__dirname, '../..'), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip tests or node scripts
  if (relPath.startsWith('.agents/') || relPath.includes('__tests__') || relPath.includes('/tests/')) {
    return;
  }

  // Find data imports
  const dataImports = [];
  const importLines = content.match(/import\s+\{?([^}]+)\}?\s+from\s+['"]([^'"]+)['"]/g) || [];
  importLines.forEach(imp => {
    if (imp.includes('utils/') || imp.includes('data/') || imp.includes('liveData') || imp.includes('useAppStore')) {
      dataImports.push(imp.trim());
    }
  });

  // Find accessed properties using regex like item.prop, job.title, student.name, user.avatar, etc.
  const propAccesses = new Set();
  const fieldRegex = /\b([a-zA-Z0-9_$]+)\.([a-zA-Z0-9_$]+)\b/g;
  let m;
  const commonGlobals = new Set(['Math', 'Object', 'Array', 'console', 'JSON', 'Date', 'window', 'document', 'e', 'evt', 'event', 'React', 'process', 'localStorage', 'sessionStorage', 'history', 'navigator', 'location']);
  while ((m = fieldRegex.exec(content)) !== null) {
    const objName = m[1];
    const fieldName = m[2];
    if (!commonGlobals.has(objName) && fieldName.length > 1) {
      propAccesses.add(`${objName}.${fieldName}`);
    }
  }

  // Check for placeholder patterns
  const placeholders = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/lorem\s+ipsum/i.test(line)) placeholders.push({ line: idx + 1, type: 'Lorem Ipsum text', text: trimmed });
    if (/placeholder/i.test(line) && !line.includes('placeholder=') && !line.includes('Placeholder')) {
      placeholders.push({ line: idx + 1, type: 'Placeholder mention', text: trimmed });
    }
    if (/unsplash\.com/i.test(line) || /via\.placeholder\.com/i.test(line)) {
      placeholders.push({ line: idx + 1, type: 'External placeholder image URL', text: trimmed });
    }
    if (/TODO/i.test(line)) {
      placeholders.push({ line: idx + 1, type: 'TODO marker', text: trimmed });
    }
    if (/sample|example\.com|test@test\.com|john\.doe|jane\.doe/i.test(line) && !relPath.includes('test')) {
      placeholders.push({ line: idx + 1, type: 'Sample/Dummy hardcoded text', text: trimmed });
    }
  });

  componentAudits.push({
    file: relPath,
    dataImports,
    propAccesses: Array.from(propAccesses),
    placeholders
  });
});

fs.writeFileSync(path.join(__dirname, 'component_audits.json'), JSON.stringify(componentAudits, null, 2));
console.log(`Analyzed ${componentAudits.length} components/files.`);
