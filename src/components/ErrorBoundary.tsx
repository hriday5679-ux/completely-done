import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, LogOut, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleResetSession = () => {
    sessionStorage.clear();
    localStorage.removeItem('aicte_session');
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected rendering error occurred.';

      return (
        <div className="min-h-screen bg-gradient-to-br from-[#07162b] via-[#0a1e38] to-[#0f2d52] flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-blue-600 selection:text-white">
          <div className="max-w-lg w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            {/* Warning Shield */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-blue-950 shadow-xl">
              <ShieldAlert className="w-8 h-8 text-blue-950" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                AICTE FDR360 • System Recovery
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                Application Rendering Notice
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                A localized component encountered a temporary issue. Your statutory records and session are secure.
              </p>
            </div>

            {/* Error Detail Card */}
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-amber-300/90 overflow-x-auto max-h-32">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans font-bold">
                Diagnostics:
              </div>
              <div className="break-words">{errorMessage}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-semibold text-xs rounded-xl border border-red-800/60 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
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
