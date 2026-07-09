const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

(async () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
  });

  const window = dom.window;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;

  // Crucial: define localStorage with exact strings that JSON.parse can read
  const storage = new Map();
  storage.set('iesu_view_v1', '"admin"');
  storage.set('iesu_user_role_v1', '"admin"');
  storage.set('iesu_mock_user', JSON.stringify({ id: 'ADM-001', name: 'Admin', role: 'admin' }));
  storage.set('iesu_academic_role', '"super_admin"');

  window.localStorage = {
    getItem: (k) => storage.has(k) ? storage.get(k) : null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear(),
  };

  window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });

  let errorCaught = null;
  const origError = console.error;
  console.error = (...args) => {
    origError(...args);
    errorCaught = args.join(' ');
  };

  const distDir = path.join(__dirname, "dist", "assets");
  const files = fs.readdirSync(distDir);
  const jsFile = files.find(f => f.endsWith(".js"));
  const code = fs.readFileSync(path.join(distDir, jsFile), "utf-8");

  try {
    const script = window.document.createElement("script");
    script.textContent = code;
    window.document.body.appendChild(script);

    setTimeout(async () => {
      console.log("App mounted. Checking if we are in Admin Dashboard...");
      
      const adminHeader = window.document.querySelector('header');
      if (adminHeader && adminHeader.textContent.includes('Yönetim')) {
          console.log("Successfully rendered Admin Dashboard!");
      } else {
          console.log("Did not render Admin Dashboard. Body HTML:");
          console.log(window.document.body.innerHTML.substring(0, 500));
      }

      const buttons = Array.from(window.document.querySelectorAll('button'));
      console.log("Total buttons found:", buttons.length);
      
      for (const btn of buttons) {
        const text = btn.textContent.trim();
        if (text) {
          console.log("Clicking:", text);
          errorCaught = null;
          btn.click();
          await new Promise(r => setTimeout(r, 100));
          if (errorCaught) {
            console.log("!!! CRASH WHEN CLICKING:", text);
            console.log("ERROR:", errorCaught);
          }
        }
      }
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error("Caught error evaluating script:", err);
    process.exit(1);
  }
})();
