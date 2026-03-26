import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

const Footer = () => (
  <footer style={{ background: '#1F2937', color: '#D1D5DB', paddingTop: '56px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 2fr 1.6fr', gap: '2.5rem', paddingBottom: '3rem' }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="FYC" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #C8102E' }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>Fulbari Yuba Club</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', letterSpacing: '1px' }}>JAKMA · EST. 2057 BS</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Links</h4>
          {[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Programs'], ['/blog', 'Blog'], ['/gallery', 'Gallery']].map(([to, label]) => (
            <NavLink key={to} to={to} onClick={handleNavClick} end={to === '/'} style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '8px', transition: 'color 0.2s'}}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              {label}
            </NavLink>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>Contact</h4>
          <div style={{ fontSize: '0.88rem', color: '#9CA3AF', lineHeight: 2, gap: '10px' }}>
            <p style={{ display: 'flex', gap: '3px', alignItems: 'center'}}> <img src="/map.png" alt="" style={{ width: '32px', height: '24px', alignItems: 'center'}} />Manyavangyag-6, Okhaldhunga, Nepal</p>
            <p style={{ display: 'flex', gap: '3px', alignItems: 'center'}}> <img src="/phone.png" alt="" style={{ width: '32px', height: '24px', alignItems: 'center'}} /> <a href="https://mail.google.com/mail/?view=cm&fs=1&to=fulbariyubaclub@gmail.com">fulbariyubaclub@gmail.com</a></p>
            <p style={{ display: 'flex', gap: '3px', alignItems: 'center'}}> <img src="/mail.png" alt="" style={{ width: '32px', height: '24px', alignItems: 'center'}} /> + 977 9709192259 , +97709861949067</p>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textAlign: 'center', textTransform: 'uppercase', marginBottom: '1rem' }}>Social Media</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px'}}>
            <a href='https://www.facebook.com/profile.php?id=100084950064757'><img src="/facebook.png" alt="" style={{ width: '60px', height: '40px', alignItems: 'center'}}/></a>
            <a href='https://www.facebook.com/profile.php?id=100084950064757'><img src="/twitter.png" alt="" style={{ width: '40px', height: '40px', alignItems: 'center'}} /></a>
            <a href='https://www.facebook.com/profile.php?id=100084950064757'><img src="/youtube.png" alt="" style={{ width: '40px', height: '36px', alignItems: 'top'}}/></a>
            <a href='https://www.facebook.com/profile.php?id=100084950064757'><img src="/instagram.png" alt="" style={{ width: '40px', height: '40px', alignItems: 'center'}}/></a>
          </div>
        </div>

      </div>

      <div style={{ borderTop: '1px solid #374151', padding: '1.5rem 0', textAlign: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
          © {new Date().getFullYear()} Fulbari Yuba Club Jakma. All rights reserved.
        </p>
      </div>
    </div>

    <style>{`
      @media (max-width: 900px) {
        footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 600px) {
        footer > div > div:first-child { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </footer>
);

export default Footer;
