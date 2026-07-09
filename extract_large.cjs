const fs = require('fs');
const path = 'C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(path, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"type":"VIEW_FILE"') && lines[i].includes('AdminDashboard.jsx')) {
    const data = JSON.parse(lines[i]);
    if (data.content && data.content.includes('Total Lines:') && data.content.length > 50000) {
      console.log('Found VIEW_FILE at step', data.step_index, 'with length', data.content.length);
      fs.writeFileSync('recovered_admin_' + data.step_index + '.txt', data.content, 'utf8');
    }
  }
}
