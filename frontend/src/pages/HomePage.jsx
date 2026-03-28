import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { STATIC_CERTIFICATES } from '../data/certificates';
import API from '../utils/api';

const handleNavClick = () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const CATEGORY_COLOR = {
  tournament: { bg: '#FEF2F2', color: '#991B1B', label: 'Tournament' },
  community:  { bg: '#F0FDF4', color: '#166534', label: 'Community'  },
  cultural:   { bg: '#FFF7ED', color: '#9A3412', label: 'Cultural'   },
  training:   { bg: '#EFF6FF', color: '#1E40AF', label: 'Training'   },
  other:      { bg: '#F9FAFB', color: '#374151', label: 'Other'      },
};
const STATUS_COLOR = {
  upcoming: { bg: '#FEF3C7', color: '#92400E', label: 'Upcoming'  },
  active:   { bg: '#D1FAE5', color: '#065F46', label: 'Ongoing'   },
  past:     { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  draft:    { bg: '#DBEAFE', color: '#1E40AF', label: 'Draft'     },
};
const EMOJI = { tournament: '⚽', community: '🤝', cultural: '🎭', training: '🏃', other: '📌' };

const STATIC_PROGRAMS = [
  { _id: '1', title: 'Annual Football Tournament 2081', category: 'tournament', date: '2024-04-15', location: 'Jakma Ground', shortDesc: 'Grand annual football tournament featuring 16 teams from across Okhaldhunga district with exciting prizes.', status: 'upcoming' },
  { _id: '2', title: 'Youth Leadership & Development Camp', category: 'community', date: '2024-03-20', location: 'Community Hall, Jakma', shortDesc: 'A 3-day leadership camp to develop life skills among youth aged 15–25 from Manyavangyag.', status: 'past' },
  { _id: '3', title: 'Dashain Cultural Celebration', category: 'cultural', date: '2024-10-18', location: 'Jakma Village Ground', shortDesc: 'Annual Dashain celebration featuring traditional dance, Deusi Bhailo, and community feast.', status: 'past' },
];

const STATIC_STATS = [
  { num: '2057', label: 'Established (BS)', icon: '📅' },
  { num: '2+',   label: 'Programs Per Year', icon: '🏆' },
];

const SPONSORS = [
  { id: 's1', name: 'Sponsor 1', logo: '/logo.png' },
  { id: 's2', name: 'Sponsor 2', logo: '/logo.png' },
];

// ── Hero Slideshow component ──────────────────────────────────────────────────
const HeroSlideshow = ({ slides, interval }) => {
  const [current, setCurrent]   = useState(0);
  const [paused,  setPaused]    = useState(false);
  const timerRef                = useRef(null);

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [slides.length, interval, paused]);

  const goTo = (idx) => {
    setCurrent(idx);
    // Reset timer on manual navigation
    clearInterval(timerRef.current);
    if (!paused && slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, interval);
    }
  };

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  return (
    <>
      {/* Background image layers — cross-fade */}
      {slides.map((slide, i) => (
        <div key={slide._id} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1s ease',
          willChange: 'opacity',
        }}>
          <img
            src={slide.url}
            alt={slide.title || slide.caption || 'FYC Jakma'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Dark gradient overlay for text legibility */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(105deg, rgba(80,4,14,0.82) 0%, rgba(30,0,5,0.60) 50%, rgba(0,0,0,0.30) 100%)',
      }} />

      {/* Subtle vignette at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
      }} />

      {/* ── Prev / Next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Previous slide"
            style={{
              position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
              zIndex: 4, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.25)', color: 'white',
              width: '44px', height: '44px', borderRadius: '50%',
              fontSize: '1.3rem', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >‹</button>
          <button
            onClick={goNext}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Next slide"
            style={{
              position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)',
              zIndex: 4, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.25)', color: 'white',
              width: '44px', height: '44px', borderRadius: '50%',
              fontSize: '1.3rem', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(-50%) scale(0.92)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >›</button>
        </>
      )}

      {/* ── Caption pill (bottom-right) ── */}
      {slides[current]?.caption && (
        <div style={{
          position: 'absolute', bottom: slides.length > 1 ? '3.5rem' : '1.5rem', right: '1.5rem',
          zIndex: 4, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          color: 'rgba(255,255,255,0.9)', padding: '5px 14px', borderRadius: '20px',
          fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em',
          border: '1px solid rgba(255,255,255,0.15)',
          maxWidth: '260px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {slides[current].caption}
        </div>
      )}

      {/* ── Navigation dots ── */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '7px', alignItems: 'center', zIndex: 4,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '22px' : '7px',
                height: '7px', borderRadius: '4px', border: 'none',
                background: i === current ? 'white' : 'rgba(255,255,255,0.38)',
                cursor: 'pointer', padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter (top-right, subtle) ── */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 4,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          color: 'rgba(255,255,255,0.7)', padding: '3px 10px', borderRadius: '20px',
          fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          {current + 1} / {slides.length}
        </div>
      )}
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const HomePage = () => {
  const [certificates,  setCertificates]  = useState([]);
  const [certLoading,   setCertLoading]   = useState(true);

  // Hero slideshow state
  const [heroSlides,   setHeroSlides]   = useState([]);
  const [heroInterval, setHeroInterval] = useState(5000); // ms
  const [heroLoading,  setHeroLoading]  = useState(true);

  // Fetch certificates
  useEffect(() => {
    API.get('/certificates?limit=3')
      .then(r => setCertificates(r.data.data || []))
      .catch(() => setCertificates(STATIC_CERTIFICATES))
      .finally(() => setCertLoading(false));
  }, []);

  // Fetch hero slides + settings
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const [slidesRes, settingsRes] = await Promise.allSettled([
          API.get('/hero-slides'),
          API.get('/hero-slides/settings'),
        ]);
        if (slidesRes.status === 'fulfilled') {
          setHeroSlides(slidesRes.value.data?.data || []);
        }
        if (settingsRes.status === 'fulfilled') {
          const ivl = settingsRes.value.data?.data?.interval;
          if (ivl && typeof ivl === 'number' && ivl >= 2000) setHeroInterval(ivl);
        }
      } catch {}
      setHeroLoading(false);
    };
    fetchHero();
  }, []);

  const displayCertificates = certificates.length > 0 ? certificates : STATIC_CERTIFICATES;
  const hasSlides = heroSlides.length > 0;

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>

      {/* ---- HERO ---- */}
      <section style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>

        {/* ── Background image (always shown as floor / loading placeholder) ── */}
        <img
          src="/background1.avif"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />

        {/* ── Slideshow (renders on top when slides exist) ── */}
        {hasSlides && (
          <HeroSlideshow slides={heroSlides} interval={heroInterval} />
        )}

      </section>

      {/* ---- STATS ---- */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'auto' }}>
            {STATIC_STATS.map((s, i) => (
              <div key={i} style={{
                padding: '2rem 1.5rem', textAlign: 'center',
                borderRight: i < 1 ? '1px solid var(--gray-200)' : 'none',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: '0.5rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURED AWARDS ---- */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Achievements</span>
            <h2 className="section-title">Awards & Recognition</h2>
            <p className="section-subtitle">Milestones that define our journey</p>
          </div>

          {certLoading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {displayCertificates.slice(0, 3).map((cert, i) => {
                const imgSrc = cert.image?.url || (typeof cert.image === 'string' ? cert.image : null);
                return (
                  <div key={cert._id || i} style={{
                    background: 'white', border: '1px solid var(--gray-200)', borderRadius: '16px',
                    overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{
                      height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: imgSrc ? 'transparent' : 'linear-gradient(135deg,#7B0A1A,#C8102E)',
                      overflow: 'hidden',
                    }}>
                      {imgSrc
                        ? <img src={imgSrc} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '3rem' }}>{cert.icon || '🏆'}</span>
                      }
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#C8102E', marginBottom: '0.5rem' }}>
                        {cert.issuer}
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                        {cert.title}
                      </h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {cert.description}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>📅 {cert.yearBS}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <NavLink to="/awards" onClick={handleNavClick} className="btn btn-outline btn-lg">
              View All Awards →
            </NavLink>
          </div>
        </div>
      </section>

      {/* ---- PRESIDENT MESSAGE ---- */}
      <section className="section" style={{ background: 'linear-gradient(135deg,#777777,#CCCCCC)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px', height: '160px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '4rem', margin: '0 auto 1rem',
              }}>
                <img src="/president.jpeg" alt="" style={{ width: '160px', height: '160px', borderRadius: '50%' }} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1rem' }}>Mr. Amrit Bahadur Rai</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>Club President</div>
            </div>
            <div>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '30px', display: 'inline-block', marginBottom: '1rem' }}>
                President's Message
              </span>
              <blockquote style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "Fulbari Yuba Club Jakma stands as a beacon of hope and determination for the youth of Manyavangyag. Our journey since 2057 BS has been one of unity, resilience, and passion for football and community development. Together, we build not just a football club — but a family."
              </blockquote>
              <NavLink to="/about" onClick={handleNavClick} className="btn" style={{ background: 'white', color: '#111111', border: '2px solid white', fontWeight: 700 }}>
                Read More About Us →
              </NavLink>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section div[style*="auto 1fr"]{grid-template-columns:1fr!important;text-align:center;}}`}</style>
      </section>

      {/* ---- SPONSORS ---- */}
      {SPONSORS.length > 0 && (
        <section className="section-sm" style={{ background: 'white', borderTop: '1px solid var(--gray-100)' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: '2rem' }}>
              <span className="section-tag">Our Supporters</span>
              <h2 className="section-title">Sponsors & Partners</h2>
              <p className="section-subtitle">Organizations that support FYC Jakma's mission</p>
            </div>

            <div className="sponsors-grid">
              {SPONSORS.map(sp => (
                <div key={sp.id} className="sponsor-card">
                  <div className="sponsor-logo-wrap">
                    {sp.logo ? (
                      <img
                        src={sp.logo}
                        alt={sp.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="sponsor-initials">
                        {sp.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className="sponsor-name">{sp.name}</p>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            .sponsors-grid {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 1.5rem;
            }
            .sponsor-card {
              flex: 0 0 calc(20% - 1.2rem);
              max-width: calc(20% - 1.2rem);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.75rem;
              padding: 1.5rem 1rem;
              border: 1px solid var(--gray-200);
              border-radius: 12px;
              background: var(--gray-50);
              transition: box-shadow 0.2s, transform 0.2s;
            }
            .sponsor-card:hover {
              box-shadow: 0 6px 24px rgba(200,16,46,0.08);
              transform: translateY(-3px);
            }
            .sponsor-logo-wrap {
              width: 90px;
              height: 70px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .sponsor-initials {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              background: linear-gradient(135deg, #FEF2F2, #FCE7E9);
              border: 2px solid #FECACA;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.4rem;
              font-weight: 800;
              color: #C8102E;
            }
            .sponsor-name {
              font-size: 0.82rem;
              font-weight: 600;
              color: var(--gray-700);
              text-align: center;
              line-height: 1.4;
              margin: 0;
            }
            @media (max-width: 1024px) {
              .sponsor-card { flex: 0 0 calc(33.333% - 1.2rem); max-width: calc(33.333% - 1.2rem); }
            }
            @media (max-width: 640px) {
              .sponsor-card { flex: 0 0 calc(50% - 0.75rem); max-width: calc(50% - 0.75rem); }
              .sponsors-grid { gap: 1rem; }
            }
            @media (max-width: 360px) {
              .sponsor-card { flex: 0 0 100%; max-width: 100%; }
            }
          `}</style>
        </section>
      )}

    </div>
  );
};

export default HomePage;