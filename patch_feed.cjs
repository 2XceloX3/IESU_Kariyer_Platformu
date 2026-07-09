const fs = require('fs');
const path = require('path');

function search(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      search(p);
    } else if (p.endsWith('.jsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes("setView('feed')")) {
        console.log('Patching:', p);
        c = c.replace(/setView\('feed'\)/g, "setView('landing')");
        fs.writeFileSync(p, c);
      }
    }
  });
}

search('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src');
