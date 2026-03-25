import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

const Navbar = () => {
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
  };

  const links = [
    { to: '/', key: 'nav_home' },
    { to: '/about', key: 'nav_about' },
    { to: '/programs', key: 'nav_programs' },
    { to: '/awards', key: 'nav_awards' },
    { to: '/blog', key: 'nav_blog' },
    { to: '/gallery', key: 'nav_gallery' },
    { to: '/team', key: 'nav_team' },
    { to: '/contact', key: 'nav_contact' },
  ];

  const navLinkStyle = (isActive) => ({
    padding: '6px 11px',
    borderRadius: '6px',
    fontSize: '0.84rem',
    fontWeight: 600,
    color: isActive ? '#C8102E' : '#374151',
    background: isActive ? '#F5E6E9' : 'transparent',
    transition: 'all 0.2s',
    fontFamily: 'var(--font)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: `2px solid ${scrolled ? '#C8102E' : '#E5E7EB'}`,
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s',
        height: 'var(--navbar-h)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '1rem' }}>

          {/* Logo */}
          <Link to="/" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src="/logo.png"
              alt="FYC Jakma Logo"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C8102E' }}
              onError={e => {
                e.target.style.display = 'none';
                document.getElementById('logo-fallback').style.display = 'flex';
              }}
            />
            <div id="logo-fallback" style={{
              display: 'none', width: '46px', height: '46px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#C8102E,#9B0B22)',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '0.75rem',
              border: '2px solid #C8102E', flexShrink: 0,
            }}>FYC</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#C8102E', lineHeight: 1.1 }}>Fulbari Yuba Club</div>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Jakma · Est. 2057 BS</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: '1px', alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }} className="nav-desktop">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={handleNavClick}
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                {t(l.key)}
              </NavLink>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(m => !m)}
            style={{
              display: 'none',
              flexDirection: 'column', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            }}
          >
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', opacity: mobileOpen ? 0 : 1 }}></span>
            <span style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className="mobile-overlay"
            style={{ position: 'fixed', top: 'var(--navbar-h)', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}
            onClick={() => setMobileOpen(false)}
          >
            <div
              style={{ background: 'white', padding: '1rem 1.5rem 2rem', borderTop: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-lg)' }}
              onClick={e => e.stopPropagation()}
            >
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'block', padding: '13px 0',
                    fontSize: '1rem', fontWeight: 600,
                    color: isActive ? '#C8102E' : '#374151',
                    borderBottom: '1px solid var(--gray-100)',
                    textDecoration: 'none',
                  })}
                >
                  {t(l.key)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 960px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;