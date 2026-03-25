import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, setShowAdminModal } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to top on any navigation
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleAdminClick = () => {
    setMobileOpen(false);
    if (user && user.role === 'admin') {
      navigate('/admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setShowAdminModal(true);
    }
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

          {/* Right side */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {user && user.role === 'admin' ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link
                  to="/admin"
                  onClick={handleNavClick}
                  className="btn btn-primary btn-sm"
                >
                  {t('nav_dashboard')}
                </Link>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(m => !m)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px',
                      background: 'var(--gray-100)',
                      border: '1.5px solid var(--gray-200)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: '#C8102E', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 700,
                    }}>
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                    {user.name?.split(' ')[0]}
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '4px',
                      background: 'white', borderRadius: '10px',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-lg)', minWidth: '160px',
                      overflow: 'hidden', zIndex: 100,
                    }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--gray-100)', fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                        {user.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%', padding: '10px 14px', textAlign: 'left',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#C8102E', fontWeight: 600, fontSize: '0.85rem',
                          fontFamily: 'var(--font)',
                        }}
                      >
                        {t('nav_logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="btn btn-primary btn-sm"
              >
                🔐 {t('nav_admin')}
              </button>
            )}

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
              <div style={{ marginTop: '1rem' }}>
                {user && user.role === 'admin' ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to="/admin" onClick={handleNavClick} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      {t('nav_dashboard')}
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                      {t('nav_logout')}
                    </button>
                  </div>
                ) : (
                  <button onClick={handleAdminClick} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    🔐 {t('nav_admin')}
                  </button>
                )}
              </div>
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
