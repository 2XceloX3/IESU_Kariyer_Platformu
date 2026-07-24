const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(targetDir);

files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Direct substring replacements to avoid Unicode word boundary regex bugs (\b)
    content = content.replace(/İGÜ/g, 'İESÜ');
    content = content.replace(/IGU/g, 'IESU');
    content = content.replace(/İgü/g, 'İesü');
    content = content.replace(/ıgu/g, 'iesu');
    content = content.replace(/igu/g, 'iesu');
    content = content.replace(/ıgü/g, 'iesü');
    
    content = content.replace(/Gelişim Üniversitesi/g, 'İstanbul Esenyurt Üniversitesi');
    content = content.replace(/Gelisim Üniversitesi/g, 'İstanbul Esenyurt Üniversitesi');
    content = content.replace(/Gelişim/g, 'Esenyurt');
    content = content.replace(/Gelisim/g, 'Esenyurt');
    content = content.replace(/gelisim/g, 'esenyurt');
    content = content.replace(/gelişim/g, 'esenyurt');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Scrubbed Unicode: ${path.basename(file)}`);
    }
});
