import React, { useState, useEffect } from 'react';
import './App.css';
// Router renders the route elements and expects a Router provider (BrowserRouter) to be mounted above (see index.js)
import Router from './routes/Router';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import PlayerBar from './components/player/PlayerBar';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document element to support future theme-based styling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Right-side default actions for TopBar; demonstrates the slot capability
  const topBarRight = (
    <div style={{ display: 'flex', gap: '.5rem' }}>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="shadow-hover"
        style={{
          padding: '.45rem .8rem',
          borderRadius: '10px',
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        className="shadow-hover"
        style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'white' }}
      >
        Play
      </button>
    </div>
  );

  return (
    <div className="app-shell">
      {/* Sidebar (responsive, accessible) */}
      <Sidebar />

      {/* Main area: TopBar + page content */}
      <main className="main">
        <TopBar right={topBarRight} />
        <Router />
      </main>

      {/* Bottom player bar */}
      <div className="player">
        <PlayerBar />
      </div>
    </div>
  );
}

export default App;
