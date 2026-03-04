/* eslint-disable */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: '#0a1628',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 24,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏛️</div>
          <h1 style={{ color: '#e8b84b', fontSize: 28, marginBottom: 12 }}>Greenfield Academy</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 24 }}>
            Something went wrong loading this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#e8b84b',
              color: '#0a1628',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer'
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
