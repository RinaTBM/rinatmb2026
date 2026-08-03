import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.hash = '/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 px-6">
          <div className="max-w-md text-center">
            <p className="font-serif text-3xl text-ink-900 mb-3">Something went wrong</p>
            <p className="text-ink-500 mb-6">
              We encountered an unexpected issue. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
