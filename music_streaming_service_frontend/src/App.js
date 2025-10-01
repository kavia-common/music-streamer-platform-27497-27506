import React, { useState, useEffect } from 'react';
import './App.css';
import Router from './routes/Router';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document element to support future theme-based styling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Sidebar navigation items
  const Nav = () => (
    <nav>
      <ul style={{ display: 'grid', gap: '.25rem' }}>
        <li><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/">🏠 Home</NavLink></li>
        <li><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/search">🔎 Search</NavLink></li>
        <li><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/library">🎵 Library</NavLink></li>
        <li><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/playlist/123">📻 Playlist</NavLink></li>
        <li><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/account">👤 Account</NavLink></li>
      </ul>
    </nav>
  );

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Music Streamer</strong>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="shadow-hover"
              style={{
                padding: '.35rem .6rem',
                borderRadius: '10px',
                background: 'rgba(37,99,235,0.08)'
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        <Nav />
      </aside>

      {/* Main area: top bar + page content routed via Router */}
      <main className="main">
        <div className="surface gradient-header" style={{ padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Now Playing</div>
              <div className="text-muted" style={{ fontSize: '.9rem' }}>TopBar placeholder</div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button className="shadow-hover" style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
                Upgrade
              </button>
              <button className="shadow-hover" style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'white' }}>
                Play
              </button>
            </div>
          </div>
        </div>

        {/* Routed content */}
        <Router />
      </main>

      {/* Bottom player bar placeholder */}
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
