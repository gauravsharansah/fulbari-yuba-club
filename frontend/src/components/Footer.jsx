import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1F2937', color: '#D1D5DB', paddingTop: '56px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', paddingBottom: '3rem' }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <img src="/logo.jpeg" alt="FYC" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #C8102E' }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>Fulbari Yuba Club</div>
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', letterSpacing: '1px' }}>JAKMA · EST. 2057 BS</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#9CA3AF', marginBottom: '1rem' }}>
            FYC | A hub for youth, sports, culture &amp; community growth.<br />
            Manyavangyag Gaun Palika-6, Okhaldhunga, Nepal.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="https://facebook.com/fulbariyubaclub" target="_blank" rel="noreferrer"
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'background 0.2s' }}>
              f
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Pages</h4>
          {[['/', 'Home'], ['/about', 'About Us'], ['/programs', 'Programs'], ['/blog', 'Blog'], ['/gallery', 'Gallery']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '8px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Club</h4>
          {[['/team', 'Team Members'], ['/awards', 'Awards'], ['/contact', 'Contact'], ['/login', 'Member Login']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '8px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h4>
          <div style={{ fontSize: '0.88rem', color: '#9CA3AF', lineHeight: 2 }}>
            <p>📍 Jakma, Manyavangyag-6</p>
            <p>Okhaldhunga, Nepal 56100</p>
            <p style={{ marginTop: '8px' }}>📘 fulbariyubaclub</p>
            <p>🌐 434 Followers</p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #374151', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
          © {new Date().getFullYear()} Fulbari Yuba Club Jakma. All rights reserved.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6B7280' }}>
          <span>🇳🇵</span> Made with ❤️ in Nepal
        </div>
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
