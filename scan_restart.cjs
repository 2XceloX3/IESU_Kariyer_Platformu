const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu\\src';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const patterns = [
    { name: 'Hardcoded Credentials', regex: /API_KEY|token|Bearer|secret/i },
    { name: 'Localhost URL', regex: /http:\/\/localhost/i },
    { name: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/ },
    { name: 'console.log', regex: /console\.log/ }
];

const results = [];

function scanDir(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (stat.isFile() && extensions.includes(path.extname(fullPath).toLowerCase())) {
            scanFile(fullPath);
        }
    }
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        patterns.forEach(pattern => {
            if (pattern.regex.test(line)) {
                results.push({
                    file: filePath,
                    line: lineNumber,
                    type: pattern.name,
                    match: line.trim()
                });
            }
        });

        if (line.includes('<a ') && !line.includes('href=')) {
            results.push({
                file: filePath,
                line: lineNumber,
                type: '<a> without href',
                match: line.trim()
            });
        }
    });
}

scanDir(targetDir);

if (results.length > 0) {
    console.log(JSON.stringify(results, null, 2));
} else {
    console.log("No issues found.");
}
