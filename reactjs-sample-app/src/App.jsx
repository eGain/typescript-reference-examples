import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

// Lazy load components for better performance
const Login = lazy(() => import('./Login'));
const Search = lazy(() => import('./Search'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Main App Content Component
const AppContent = () => {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Suspense fallback={<LoadingSpinner />}>
        {isAuthenticated ? (
          <Search />
        ) : (
          <Login />
        )}
      </Suspense>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;