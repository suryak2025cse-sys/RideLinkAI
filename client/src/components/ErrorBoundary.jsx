import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="app-card max-w-xl w-full p-8 rounded-3xl text-center space-y-4 shadow-lg bg-white border border-slate-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Application Notice</h2>
            <p className="text-slate-500 text-sm font-semibold">
              The application encountered a render issue. Details below:
            </p>
            
            {/* Display exact error text for instant diagnosis */}
            <div className="bg-slate-900 text-amber-400 p-4 rounded-2xl text-left text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
              <p className="font-bold text-rose-400">{this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-slate-400 mt-2 text-[10px] whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="btn-primary w-full py-3.5 text-base font-black shadow-rapido-yellow text-slate-950 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
