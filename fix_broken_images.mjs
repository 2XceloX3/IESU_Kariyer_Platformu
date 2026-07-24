import fs from 'fs';
import path from 'path';

const liveDataPath = path.join(process.cwd(), 'src/utils/liveData.js');

try {
  let liveDataContent = fs.readFileSync(liveDataPath, 'utf8');

  // We are going to replace any empty.png with a beautiful Esenyurt placeholder or real logo
  const fallbackImage = '/kariyer_logo.png';
  
  // Replace the empty.png
  liveDataContent = liveDataContent.replace(/https:\/\/www\.esenyurt\.edu\.tr\/assets\/frontend\/images\/empty\.png/g, fallbackImage);
  
  fs.writeFileSync(liveDataPath, liveDataContent, 'utf8');
  console.log("Successfully fixed broken images in liveData.js");

} catch (e) {
  console.error("Error updating liveData.js:", e);
}
