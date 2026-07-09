const fs = require('fs');
const code = fs.readFileSync('C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = code.split('\n');

// Extract the BIGGEST AdminDashboard (step 5201, line index where step_index==5201)
// Also extract the 2nd biggest (step 5167)
// Also extract step 1210 (33033 bytes - the "BiggestAdmin" from before panels split)

const targets = [5201, 5167, 1210];

for (const stepTarget of targets) {
  for (let i = 0; i < lines.length; i++) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.step_index !== stepTarget) continue;
      if (!obj.tool_calls) continue;
      for (const tc of obj.tool_calls) {
        if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile && 
            tc.args.TargetFile.includes('AdminDashboard') && tc.args.CodeContent) {
          const fname = `C:/Users/celil/.gemini/antigravity/scratch/admin_step_${stepTarget}.jsx`;
          fs.writeFileSync(fname, tc.args.CodeContent, 'utf8');
          console.log('Saved step', stepTarget, '->', fname, '- Length:', tc.args.CodeContent.length);
        }
      }
    } catch(e) {}
  }
}
console.log('Done!');
