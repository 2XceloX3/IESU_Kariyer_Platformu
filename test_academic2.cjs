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

  const storage = new Map();
  storage.set('iesu_view_v1', '"academic"');
  storage.set('iesu_user_role_v1', '"academic"');
  storage.set('iesu_mock_user', JSON.stringify({ id: 'ACA-001', name: 'Academic', role: 'academic', onboardingCompleted: true }));

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
      console.log("App mounted. Checking if we are in Academic Feed...");
      const html = window.document.body.innerHTML;
      if (html.includes('Platformda Bir Hata')) {
          console.log("CRASH CAUGHT BY ERROR BOUNDARY!");
          console.log("ERROR:", errorCaught);
      } else {
          console.log("Rendered successfully without ErrorBoundary.");
          if (errorCaught) {
             console.log("BUT there was an error in console:", errorCaught);
          }
      }
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error("Caught error evaluating script:", err);
    process.exit(1);
  }
})();
