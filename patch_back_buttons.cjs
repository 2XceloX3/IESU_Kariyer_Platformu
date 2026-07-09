const fs = require('fs');

function addWrapper(filePath, functionName, imports) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  if (c.includes('Geri Dön')) {
    console.log(`Already patched ${filePath}`);
    return;
  }

  // Add ChevronLeft to lucide-react imports if missing
  if (!c.includes('ChevronLeft')) {
    c = c.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, ChevronLeft } from 'lucide-react';");
  }

  // Find the return statement
  const returnRegex = /return\s*\(\s*<div/i;
  const match = c.match(returnRegex);
  if (match) {
    c = c.replace(match[0], 
      `return (\n` +
      `    <div className="min-h-screen bg-gray-50 pb-20">\n` +
      `      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">\n` +
      `        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 h-16 flex items-center">\n` +
      `          <button onClick={() => { if(typeof setView === 'function') setView((typeof userRole !== 'undefined' && userRole) ? (userRole === 'admin' ? 'admin' : userRole) : 'landing'); }} className="flex items-center gap-2 text-gray-600 hover:text-iesu-red font-bold transition-colors">\n` +
      `            <ChevronLeft size={20} /> Geri Dön\n` +
      `          </button>\n` +
      `        </div>\n` +
      `      </nav>\n` +
      `      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-8">\n` +
      `        <div`
    );
    
    // Replace the very last </div>); with </div></main></div>);
    const lastDivRegex = /<\/div>\s*\);\s*\}\s*$/;
    c = c.replace(lastDivRegex, "</div>\n      </main>\n    </div>\n  );\n}\n");
    
    fs.writeFileSync(filePath, c);
    console.log(`Patched ${filePath}`);
  }
}

addWrapper('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\ApplicationsPanel.jsx');
addWrapper('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\AICVBuilder.jsx');
addWrapper('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\MessagingInterface.jsx');
