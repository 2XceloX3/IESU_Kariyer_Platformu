const fs = require('fs');

let c = fs.readFileSync('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\App.jsx', 'utf8');

if (!c.includes("view === 'applications'")) {
  c = c.replace('</ErrorBoundary>', 
    `      {view === 'applications' && <ApplicationsPanel applications={applications} currentUser={currentUser} userRole={userRole} setView={setView} />}\n` +
    `      {view === 'cvbuilder' && <AICVBuilder currentUser={currentUser} setView={setView} />}\n` +
    `      {view === 'messaging' && <MessagingInterface messages={messages} setMessages={setMessages} currentUser={currentUser} userRole={userRole} contacts={[...students, ...alumni, ...companies, ...academicStaff]} setView={setView} setSelectedUserId={setSelectedUserId} />}\n` +
    `    </ErrorBoundary>`
  );
  
  c = c.replace("import CalendarView from './components/CalendarView';", 
    "import CalendarView from './components/CalendarView';\n" +
    "import ApplicationsPanel from './components/ApplicationsPanel';\n" +
    "import AICVBuilder from './components/AICVBuilder';\n" +
    "import MessagingInterface from './components/MessagingInterface';\n"
  );
  
  fs.writeFileSync('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\App.jsx', c);
  console.log("Patched App.jsx");
} else {
  console.log("Already patched");
}
