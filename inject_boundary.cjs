const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes('ErrorBoundary')) {
  const boundaryCode = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

  app = app.replace('function App() {', boundaryCode + '\nfunction App() {');
  app = app.replace('return (', 'return (\n    <ErrorBoundary>');
  app = app.replace(');', '\n    </ErrorBoundary>\n  );');
  
  fs.writeFileSync('src/App.jsx', app, 'utf8');
}
