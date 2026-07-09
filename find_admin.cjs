const fs = require('fs');
const readline = require('readline');
const transcriptPath = 'C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl';

async function processTranscript() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let v = 1;
  for await (const line of rl) {
    if (!line.trim()) continue;
    const step = JSON.parse(line);

    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name.includes('write_to_file') || call.name.includes('replace_file_content')) {
          let args = call.arguments;
          if (typeof args === 'string') {
             try { args = JSON.parse(args); } catch(e) {}
          }
          if (args && args.TargetFile && args.TargetFile.includes('AdminDashboard.jsx')) {
             console.log('Found AdminDashboard write at step', step.step_index, call.name);
             if (args.CodeContent) {
                fs.writeFileSync('C:/Users/celil/.gemini/antigravity/scratch/AdminDashboard_v' + v + '_step' + step.step_index + '.jsx', args.CodeContent, 'utf8');
                console.log('Saved AdminDashboard v' + v + ' from step ' + step.step_index + ', length:', args.CodeContent.length);
                v++;
             }
          }
        }
      }
    }
  }
}
processTranscript();
