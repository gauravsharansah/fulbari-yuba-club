import React from 'react';
import { useLang } from '../context/LanguageContext.jsx';

const LanguageToggle = () => {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      title={lang === 'en' ? 'Switch to Nepali' : 'English मा जानुहोस्'}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: lang === 'en'
          ? 'linear-gradient(135deg, #C8102E, #9B0B22)'
          : 'linear-gradient(135deg, #003893, #C8102E)',
        border: '3px solid white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1px',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
      }}
    >
      <span style={{
        fontSize: '0.65rem',
        fontWeight: 800,
        color: 'white',
        letterSpacing: '0.5px',
        lineHeight: 1,
      }}>
        {lang === 'en' ? 'नेपा' : 'ENG'}
      </span>
      <span style={{
        fontSize: '0.55rem',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1,
      }}>
        {lang === 'en' ? 'ली' : 'LISH'}
      </span>
      <div style={{
        width: '20px',
        height: '2px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '2px',
        margin: '2px 0',
      }} />
      <span style={{ fontSize: '0.9rem' }}>
        {lang === 'en' ? '🇳🇵' : '🇬🇧'}
      </span>
    </button>
  );
};

export default LanguageToggle;
