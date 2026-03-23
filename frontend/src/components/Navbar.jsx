import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/awards', label: 'Awards' },
    { to: '/blog', label: 'Blog' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/team', label: 'Team' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: `2px solid ${scrolled ? '#C8102E' : '#E5E7EB'}`,
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s',
      height: 'var(--navbar-h)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src="/logo.jpeg"
            alt="FYC Logo"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C8102E' }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none', width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#C8102E,#9B0B22)',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.8rem', border: '2px solid #C8102E'
          }}>FYC</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#C8102E', lineHeight: 1.1 }}>Fulbari Yuba Club</div>
            <div style={{ fontSize: '0.68rem', color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Jakma · Est. 2057 BS</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              style={({ isActive }) => ({
                padding: '6px 12px', borderRadius: '6px',
                fontSize: '0.86rem', fontWeight: 600,
                color: isActive ? '#C8102E' : '#374151',
                background: isActive ? '#F5E6E9' : 'transparent',
                transition: 'all 0.2s', fontFamily: 'var(--font)',
                textDecoration: 'none'
              })}
            >{l.label}</NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="nav-auth">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-sm">Dashboard</Link>
              )}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMobileOpen(m => !m)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', background: 'var(--gray-100)',
                    border: '1.5px solid var(--gray-200)', borderRadius: '8px',
                    fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#C8102E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  {user.name?.split(' ')[0]}
                </button>
                {mobileOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '4px',
                    background: 'white', borderRadius: '10px', border: '1px solid var(--gray-200)',
                    boxShadow: 'var(--shadow-lg)', minWidth: '160px', overflow: 'hidden', zIndex: 100
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      {user.email}
                    </div>
                    <button onClick={handleLogout} style={{
                      width: '100%', padding: '10px 16px', textAlign: 'left',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#C8102E', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font)'
                    }}>Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/login?tab=admin" className="btn btn-primary btn-sm">Admin</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(m => !m)}
            style={{
              display: 'none', flexDirection: 'column', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
            }}
          >
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-nav" style={{
          position: 'fixed', top: 'var(--navbar-h)', left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 999
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            background: 'white', padding: '1.5rem',
            borderTop: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-lg)'
          }} onClick={e => e.stopPropagation()}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '12px 0',
                  fontSize: '1rem', fontWeight: 600,
                  color: isActive ? '#C8102E' : '#374151',
                  borderBottom: '1px solid var(--gray-100)',
                  textDecoration: 'none'
                })}
              >{l.label}</NavLink>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {user ? (
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Sign Out</button>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
                  <Link to="/login?tab=admin" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Admin</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: flex !important; }
          .nav-auth .btn-ghost, .nav-auth .btn-primary:not(.btn-primary) { display: none; }
        }
        @media (max-width: 640px) {
          .nav-auth .btn { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
