import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

// Since App.jsx imports Lucide icons and other stuff, we might need esbuild or babel to compile this test script.
