const fs = require('fs');
const path = require('path');
const dirs = ['src/components', 'src/components/admin'];

dirs.forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).forEach(f => {
    const p = path.join(dir, f);
    const content = fs.readFileSync(p, 'utf8');
    const newContent = content.replace(/userRole === 'admin' \? 'student'/g, "userRole === 'admin' ? 'admin'");
    if (content !== newContent) {
      fs.writeFileSync(p, newContent);
      console.log('Updated ' + f);
    }
  });
});
