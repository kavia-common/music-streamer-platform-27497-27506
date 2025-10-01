import React, { useState, useEffect } from 'react';
import './App.css';
import Router from './routes/Router';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

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

      {/* Bottom player bar placeholder (unchanged) */}
      <div className="player">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div className="surface" style={{ width: 44, height: 44, borderRadius: 8 }} />
            <div>
              <div style={{ fontWeight: 600 }}>Track title</div>
              <div className="text-muted" style={{ fontSize: '.85rem' }}>Artist</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <button className="shadow-hover" style={{ padding: '.4rem .7rem', borderRadius: 10 }}>⏮</button>
            <button className="shadow-hover" style={{ padding: '.5rem 1rem', borderRadius: 10, background: 'var(--color-primary)', color: 'white' }}>⏯</button>
            <button className="shadow-hover" style={{ padding: '.4rem .7rem', borderRadius: 10 }}>⏭</button>
          </div>
          <div style={{ minWidth: 160 }}>
            <div className="surface" style={{ height: 8, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', background: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
