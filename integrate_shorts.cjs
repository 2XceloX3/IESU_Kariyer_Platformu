const fs = require('fs');
let code = fs.readFileSync('src/components/StudentFeed.jsx', 'utf8');

// 1. Add import for CareerShorts
code = code.replace(
  "import JobsAndInternships from './JobsAndInternships';",
  "import JobsAndInternships from './JobsAndInternships';\nimport CareerShorts from './CareerShorts';"
);

// 2. Add state for showing shorts
code = code.replace(
  "const [activeTab, setActiveTab] = useState('feed');",
  "const [activeTab, setActiveTab] = useState('feed');\n  const [showShorts, setShowShorts] = useState(false);"
);

// 3. Update the onClick in the Right Panel widget
code = code.replace(
  '<button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">',
  '<button onClick={() => setShowShorts(true)} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">'
);

// 4. Render the CareerShorts component at the bottom of the component
const renderShorts = 
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
    </div>
  );
}
;
code = code.replace(
  "    </div>\n  );\n}",
  renderShorts
);

fs.writeFileSync('src/components/StudentFeed.jsx', code);
console.log('CareerShorts integrated into StudentFeed');
