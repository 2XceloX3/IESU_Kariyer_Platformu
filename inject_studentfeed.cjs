const fs = require('fs');
let code = fs.readFileSync('src/components/StudentFeed.jsx', 'utf8');

if (!code.includes('class ErrorBoundary')) {
  const boundaryCode = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('StudentFeed Error:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className='p-8 bg-red-100 text-red-900'><h1>StudentFeed Crashed</h1><pre>{this.state.error.toString()}</pre></div>;
    return this.props.children;
  }
}
`;

  code = code.replace('export default function StudentFeed({', boundaryCode + '\nexport default function StudentFeedRaw({');
  code = code + '\nexport default function StudentFeed(props) { return React.createElement(ErrorBoundary, null, React.createElement(StudentFeedRaw, props)); }\n';
  fs.writeFileSync('src/components/StudentFeed.jsx', code, 'utf8');
}
