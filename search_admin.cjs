const fs = require('fs'); 
const path = require('path'); 
const dir = 'C:/Users/celil/.gemini/antigravity/scratch/IESU_Kariyer_Platformu/src/components/admin'; 
const results = []; 
function walk(d) { 
  fs.readdirSync(d).forEach(f => { 
    const p = path.join(d, f); 
    if (fs.statSync(p).isDirectory()) walk(p); 
    else if (f.endsWith('.jsx')) { 
      const lines = fs.readFileSync(p, 'utf-8').split('\n'); 
      lines.forEach((l, i) => { 
        if (l.match(/yakında/i) || l.match(/yapım aşamasında/i) || l.match(/alert\(/i) || l.match(/TODO/i) || l.match(/onClick=\{?\(\)\s*=>\s*\{\s*\}?\}/) || l.match(/toast/i)) 
          results.push({file: f, line: i+1, content: l.trim()}); 
      }); 
    } 
  }); 
} 
walk(dir); 
console.log(JSON.stringify(results, null, 2));
