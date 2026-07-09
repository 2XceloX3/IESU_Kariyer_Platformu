const fs = require('fs');
const path = 'C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(path, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('"TargetFile":"C:\\\\Users\\\\celil\\\\.gemini\\\\antigravity\\\\scratch\\\\IesuKariyer\\\\src\\\\components\\\\AdminDashboard.jsx"')) {
    const data = JSON.parse(line);
    if (data.step_index >= 3837 && data.tool_calls) {
      console.log('Found edit at step', data.step_index);
      for(const tc of data.tool_calls) {
        if(tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
           if(tc.args.TargetContent) {
             console.log('TargetContent length:', tc.args.TargetContent.length);
             fs.writeFileSync('recovered_admin_step_' + data.step_index + '.jsx', tc.args.TargetContent, 'utf8');
             console.log('Wrote recovered_admin_step_' + data.step_index + '.jsx');
           }
           if(tc.args.ReplacementChunks) {
             tc.args.ReplacementChunks.forEach((c, idx) => {
               console.log('Chunk', idx, 'TargetContent length:', c.TargetContent.length);
               fs.writeFileSync('recovered_admin_step_' + data.step_index + '_chunk_' + idx + '.jsx', c.TargetContent, 'utf8');
             });
           }
        }
      }
    }
  }
}
