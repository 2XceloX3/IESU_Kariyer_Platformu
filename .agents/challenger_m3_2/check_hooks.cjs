const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../src');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== '__tests__' && file !== 'assets') {
        getFiles(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getFiles(srcDir);
console.log(`Found ${files.length} js/jsx files in src.`);

let issues = [];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Track early returns
  let foundReturn = false;
  let returnLineNum = 0;
  
  // Simple check for use* calls after a return outside of inner functions
  // Or check if use* is inside if(...)
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    
    // Check if hook call is inside conditional statement like `if (...) useState`
    if (/if\s*\(.*\)\s*use[A-Z]/.test(line)) {
      issues.push({ file: filePath, line: lineNum, type: 'HOOK_IN_IF', content: line.trim() });
    }
    
    // Check for `use*` after a top-level return in component
    // Note: this is a heuristic to spot early returns before hooks
  });

  // Let's also check for hooks inside condition blocks
  const hookRegex = /(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useImperativeHandle|useLayoutEffect|useDebugValue|useId)\s*\(/g;
  
  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    const index = match.index;
    const preText = content.substring(0, index);
    
    // Check if there is an early return before this hook inside the same component definition
    // Find closest function definition before index
    const funcMatch = preText.lastIndexOf('function ');
    const constFuncMatch = preText.lastIndexOf('=>');
    const funcStart = Math.max(funcMatch, constFuncMatch);
    
    if (funcStart !== -1) {
      const codeBetween = preText.substring(funcStart, index);
      // Check if `return ` occurs before the hook, but not inside a callback function
      // Simple heuristic: if return statement is at top level of component before hook
      const returnMatches = [...codeBetween.matchAll(/\breturn\b/g)];
      for (const rm of returnMatches) {
        // count braces between return and hook to see if return was inside a helper/callback
        const segment = codeBetween.substring(rm.index);
        const openBraces = (segment.match(/\{/g) || []).length;
        const closeBraces = (segment.match(/\}/g) || []).length;
        if (openBraces === closeBraces) {
          issues.push({
            file: filePath,
            type: 'HOOK_AFTER_RETURN',
            hook: match[1],
            snippet: lineAt(content, index)
          });
          break;
        }
      }
    }
  }
});

function lineAt(str, index) {
  const lineNo = str.substring(0, index).split('\n').length;
  const lineText = str.split('\n')[lineNo - 1];
  return `Line ${lineNo}: ${lineText.trim()}`;
}

console.log(`\nPotential Hook issues found: ${issues.length}`);
issues.forEach(iss => console.log(`[${iss.type}] ${path.relative(srcDir, iss.file)} - ${iss.snippet || iss.content}`));
