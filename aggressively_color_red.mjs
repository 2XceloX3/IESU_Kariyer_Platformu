import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace hardcoded Gelisim Dark Blue hex with Iesu Primary
  content = content.replace(/#0A2342/ig, '#990000');
  content = content.replace(/#1a2744/ig, '#990000');
  content = content.replace(/#202c4c/ig, '#D32F2F');
  content = content.replace(/#243f6e/ig, '#D32F2F');

  // Replace Tailwind blue, slate, indigo, sky, cyan, teal with red/coral equivalents
  content = content.replace(/\bblue-50/g, 'red-50');
  content = content.replace(/\bblue-100/g, 'red-100');
  content = content.replace(/\bblue-200/g, 'red-200');
  content = content.replace(/\bblue-300/g, 'red-300');
  content = content.replace(/\bblue-400/g, 'red-400');
  content = content.replace(/\bblue-500/g, 'red-500');
  content = content.replace(/\bblue-600/g, 'red-600');
  content = content.replace(/\bblue-700/g, 'red-700');
  content = content.replace(/\bblue-800/g, 'red-800');
  content = content.replace(/\bblue-900/g, 'red-900');
  content = content.replace(/\bblue-950/g, 'red-950');

  content = content.replace(/\bindigo-500/g, 'red-500');
  content = content.replace(/\bindigo-600/g, 'red-600');
  
  content = content.replace(/\bsky-500/g, 'red-500');
  content = content.replace(/\bsky-600/g, 'red-600');
  
  content = content.replace(/\bcyan-500/g, 'rose-500');
  
  content = content.replace(/\bteal-500/g, 'orange-500');

  // Replace slate (which was used heavily for dark themes) with red/rose darks
  content = content.replace(/\bslate-900/g, 'red-950');
  content = content.replace(/\bslate-800/g, 'red-900');
  // keep lighter slates for text legibility, maybe change slate-700
  
  // Specific fix for Footer.jsx if it has missing classes
  // Also ensure tailwind iesu colors are properly matched
  content = content.replace(/bg-iesu-blue/g, 'bg-iesu-primary');
  content = content.replace(/text-iesu-blue/g, 'text-iesu-primary');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Aggressively colored: ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

console.log('Starting aggressive red/coral color replacement...');
traverseDir(targetDir);
console.log('Done!');
