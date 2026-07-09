const fs = require('fs');
const readline = require('readline');
const transcriptPath = 'C:/Users/celil/.gemini/antigravity/brain/a8fbbcb9-3925-4d95-8121-c5241d9a59ec/.system_generated/logs/transcript_full.jsonl';

async function processTranscript() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let v = 1;
  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // Check if the line contains a huge payload of AdminDashboard
    if (line.includes('export default function AdminDashboard')) {
       if (line.length > 50000) {
           fs.writeFileSync('C:/Users/celil/.gemini/antigravity/scratch/HugeAdmin_' + v + '_step_' + JSON.parse(line).step_index + '.txt', line, 'utf8');
           console.log('Saved huge line from step', JSON.parse(line).step_index, 'len:', line.length);
           v++;
       }
    }
  }
}
processTranscript();
