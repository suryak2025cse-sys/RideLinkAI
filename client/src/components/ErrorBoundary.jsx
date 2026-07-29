import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="app-card max-w-md w-full p-8 rounded-3xl text-center space-y-4 shadow-card">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Something went wrong</h2>
            <p className="text-slate-500 text-sm">
              An unexpected render issue occurred. We've captured the log and you can recover instantly by clicking below.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary w-full py-3 text-base font-bold shadow-md flex items-center justify-center gap-2"
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
