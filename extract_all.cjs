const fs = require('fs');
const code = fs.readFileSync('C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = code.split('\n');

// Files to extract: step 5201 (biggest admin), step 613 (NewsEvents), step 1003 (StudentFeed), step 1382 (mockData)
const targets = [
  { step: 5201, file: 'AdminDashboard.jsx',  out: 'C:/Users/celil/.gemini/antigravity/scratch/admin_step_5201.jsx' },
  { step: 613,  file: 'NewsEvents.jsx',       out: 'C:/Users/celil/.gemini/antigravity/scratch/NewsEvents_613.jsx' },
  { step: 1003, file: 'StudentFeed.jsx',      out: 'C:/Users/celil/.gemini/antigravity/scratch/StudentFeed_1003.jsx' },
  { step: 1382, file: 'mockData.js',          out: 'C:/Users/celil/.gemini/antigravity/scratch/mockData_1382.js' },
  { step: 2508, file: 'SemPanel.jsx',         out: 'C:/Users/celil/.gemini/antigravity/scratch/SemPanel_2508.jsx' },
  { step: 526,  file: 'StajPanel.jsx',        out: 'C:/Users/celil/.gemini/antigravity/scratch/StajPanel_526.jsx' },
];

for (const t of targets) {
  for (let i = 0; i < lines.length; i++) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.step_index !== t.step) continue;
      if (!obj.tool_calls) continue;
      for (const tc of obj.tool_calls) {
        if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile &&
            tc.args.TargetFile.endsWith(t.file) && tc.args.CodeContent) {
          fs.writeFileSync(t.out, tc.args.CodeContent, 'utf8');
          console.log('Saved step', t.step, t.file, '->', t.out, '(', tc.args.CodeContent.length, 'bytes)');
        }
      }
    } catch(e) {}
  }
}
console.log('Done!');
