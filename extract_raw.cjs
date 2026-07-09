const fs = require('fs');
const path = 'C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(path, 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('"type":"VIEW_FILE"') && lines[i].includes('AdminDashboard.jsx') && !lines[i].includes('src/components/admin/')) {
    const data = JSON.parse(lines[i]);
    if (data.content && data.content.includes('Total Lines: 188')) {
      console.log('Found VIEW_FILE at step', data.step_index);
      fs.writeFileSync('recovered_raw.txt', data.content, 'utf8');
      break;
    }
  }
}
