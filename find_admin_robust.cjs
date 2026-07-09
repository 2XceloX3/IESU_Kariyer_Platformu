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
        // Just stringify the whole call arguments and look for 'export default function AdminDashboard'
        const argStr = JSON.stringify(call.arguments || {});
        if (argStr.includes('export default function AdminDashboard') && argStr.includes('lucide-react')) {
           // It's probably the file! Let's extract CodeContent or ReplacementContent or whatever
           let code = '';
           try {
              if (call.arguments.CodeContent) code = call.arguments.CodeContent;
              else if (call.arguments.ReplacementContent) code = call.arguments.ReplacementContent;
           } catch(e) {}
           
           if (!code) {
             const m = argStr.match(/"CodeContent":"(.*?)","/);
             if (m) code = m[1];
           }

           // Fallback to regex extracting the component
           if (!code) {
               const idx = argStr.indexOf('import React');
               if (idx > -1) {
                   code = argStr.substring(idx, argStr.lastIndexOf('}') + 1);
               }
           }
           
           if (code && code.length > 500) {
              code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"');
              fs.writeFileSync('C:/Users/celil/.gemini/antigravity/scratch/AdminDashboard_HISTORY_' + v + '_step' + step.step_index + '.jsx', code, 'utf8');
              console.log('Saved AdminDashboard v' + v + ' from step ' + step.step_index + ' length: ' + code.length);
              v++;
           }
        }
      }
    }
  }
}
processTranscript();
