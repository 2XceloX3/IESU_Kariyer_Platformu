import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Beklenmeyen Bir Hata Oluştu</h2>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Sistemsel bir sorun nedeniyle bu sayfayı şu an görüntüleyemiyoruz. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
            </p>
            <div className="text-left mb-6 p-3 bg-red-50 text-red-800 rounded-xl overflow-auto text-xs font-mono max-h-48 border border-red-100">
              <p className="font-bold mb-1 text-red-900">{this.state.error && this.state.error.toString()}</p>
              <pre className="text-[10px] whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <RefreshCw size={18} /> Sayfayı Yenile
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Home size={18} /> Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
