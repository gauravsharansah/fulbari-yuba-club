import React, { useEffect, useState } from 'react';
import { Link,NavLink } from 'react-router-dom';
import { STATIC_CERTIFICATES } from '../data/certificates';
import API from '../utils/api';

const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

const CATEGORY_COLOR = {
  tournament: { bg: '#FEF2F2', color: '#991B1B', label: 'Tournament' },
  community: { bg: '#F0FDF4', color: '#166534', label: 'Community' },
  cultural: { bg: '#FFF7ED', color: '#9A3412', label: 'Cultural' },
  training: { bg: '#EFF6FF', color: '#1E40AF', label: 'Training' },
  other: { bg: '#F9FAFB', color: '#374151', label: 'Other' },
};
const STATUS_COLOR = {
  upcoming: { bg: '#FEF3C7', color: '#92400E', label: 'Upcoming' },
  active: { bg: '#D1FAE5', color: '#065F46', label: 'Ongoing' },
  past: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  draft: { bg: '#DBEAFE', color: '#1E40AF', label: 'Draft' },
};
const EMOJI = { tournament: '⚽', community: '🤝', cultural: '🎭', training: '🏃', other: '📌' };

const STATIC_PROGRAMS = [
  { _id: '1', title: 'Annual Football Tournament 2081', category: 'tournament', date: '2024-04-15', location: 'Jakma Ground', shortDesc: 'Grand annual football tournament featuring 16 teams from across Okhaldhunga district with exciting prizes.', status: 'upcoming' },
  { _id: '2', title: 'Youth Leadership & Development Camp', category: 'community', date: '2024-03-20', location: 'Community Hall, Jakma', shortDesc: 'A 3-day leadership camp to develop life skills among youth aged 15–25 from Manyavangyag.', status: 'past' },
  { _id: '3', title: 'Dashain Cultural Celebration', category: 'cultural', date: '2024-10-18', location: 'Jakma Village Ground', shortDesc: 'Annual Dashain celebration featuring traditional dance, Deusi Bhailo, and community feast.', status: 'past' },
];

const STATIC_STATS = [
  { num: '2057', label: 'Established (BS)', icon: '📅' },
  { num: '2+', label: 'Programs Per Year', icon: '🏆' },
];

// Add your sponsors here. Set logo to a path in /public, or null to show initials.
const SPONSORS = [
  { id: 's1', name: 'Sponsor 1', logo: '/logo.png' },
  { id: 's2', name: 'Sponsor 2', logo: '/logo.png' },
];

const HomePage = () => {
  // const [programs, setPrograms] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   API.get('/programs?limit=3').then(r => setPrograms(r.data.data || [])).catch(() => setPrograms(STATIC_PROGRAMS)).finally(() => setLoading(false));
  // }, []);

  // const displayPrograms = programs.length > 0 ? programs : STATIC_PROGRAMS;
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/certificates?limit=3').then(r => setCertificates(r.data.data || [])).catch(() => setCertificates(STATIC_CERTIFICATES)).finally(() => setLoading(false));
  }, []);

  const displayCertificates = certificates.length > 0 ? certificates : STATIC_CERTIFICATES;

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>

      {/* ---- HERO ---- */}
      <section style={{
        background: 'linear-gradient(135deg, #7B0A1A 0%, #C8102E 45%, #E8304A 100%)',
        minHeight: '88vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        {/* Right decorative */}
        <div style={{
          position: 'absolute', right: '-100px', top: '50%', transform: 'translateY(-50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'
        }} />
        <div style={{
          position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '30px', padding: '6px 16px', marginBottom: '1.5rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86EFAC', display: 'inline-block' }}></span>
                <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1px' }}>
                  Jakma, Manyavangyag-6, Okhaldhunga
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800,
                color: 'white', lineHeight: 1.1, marginBottom: '0.5rem'
              }}>
                Fulbari Yuba Club
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
                color: 'rgba(255,255,255,0.85)', marginBottom: '1rem', letterSpacing: '2px'
              }}>
                JAKMA — F.Y.C
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.5rem', fontWeight: 500 }}>
                फुलबारी युवा क्लव जाक्मा
              </p>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', marginBottom: '2rem', maxWidth: '520px', lineHeight: 1.7 }}>
                A hub for youth, sports, culture &amp; community growth. Nurturing talent and fostering community development since 2057 BS.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/programs" className="btn btn-lg" style={{
                  background: 'white', color: '#C8102E', border: '2px solid white', fontWeight: 700
                }}>View Programs</Link>
                <Link to="/about" className="btn btn-lg" style={{
                  background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)'
                }}>About Club</Link>
              </div>
            </div>

            {/* Logo */}
            <div style={{ textAlign: 'center' }} className="hero-logo-wrap">
              <div style={{
                width: '220px', height: '220px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                border: '4px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'floatLogo 4s ease-in-out infinite'
              }}>
                <img src="/logo.png" alt="FYC Jakma" style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={e => {
                    e.target.parentElement.innerHTML = `<span style="font-size:5rem">⚽</span>`;
                  }} />
              </div>
              <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '30px', padding: '6px 20px', display: 'inline-block' }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 600 }}>Est. 2057 BS · स्था: २०५७</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @media(max-width:768px) { .hero-logo-wrap { display:none; } }
        `}</style>
      </section>

      {/* ---- STATS ---- */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'auto' }}>
            {STATIC_STATS.map((s, i) => (
              <div key={i} style={{
                padding: '2rem 1.5rem', textAlign: 'center',
                borderRight: i < 1 ? '1px solid var(--gray-200)' : 'none'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C8102E', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){section div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      </section>

      {/* ---- ABOUT STRIP ---- */}
      <section className="section-sm" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { icon: '⚽', title: 'Football Excellence', desc: 'Promoting football at grassroots level in Okhaldhunga, nurturing young talent since 2057 BS.' },
              { icon: '🌸', title: 'Community Growth', desc: 'A hub for youth development, culture, and social upliftment across Manyavangyag rural municipality.' },
              { icon: '🏆', title: 'Winning Legacy', desc: 'Multiple tournament victories and certificates of excellence from district and zonal competitions.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section div[style*="repeat(3"]{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ---- RECENT PROGRAMS ---- */}
      {/* <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Latest Activities</span>
            <h2 className="section-title">Recent Programs</h2>
            <p className="section-subtitle">Events, tournaments, and community activities organized by FYC Jakma</p>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {displayPrograms.map(p => {
                const cat = CATEGORY_COLOR[p.category] || CATEGORY_COLOR.other;
                const st = STATUS_COLOR[p.status] || STATUS_COLOR.past;
                const emoji = EMOJI[p.category] || '📌';
                return (
                  <div key={p._id} className="card">
                    <div style={{
                      height: '180px', background: `linear-gradient(135deg,#FEF2F2,#FCE7E9)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {p.photos?.[0]?.url ? (
                        <img src={p.photos[0].url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>{emoji}</span>
                      )}
                      <span style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: st.bg, color: st.color,
                        fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px'
                      }}>{st.label}</span>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{cat.label}</span>
                      <h3 style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.5rem' }}>{p.title}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.shortDesc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                        <span>📍 {p.location}</span>
                        <span>📅 {new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <NavLink to="/programs" onClick={handleNavClick} className="btn btn-outline btn-lg">View All Programs →</NavLink>
          </div>
        </div>
      </section> */}

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Latest Activities</span>
            <h2 className="section-title">Recent Achievements</h2>
            <p className="section-subtitle">Competitions in which FYC Jakma had remarkable performance</p>
          </div>

          <div className="grid-3">
            {STATIC_CERTIFICATES.slice(0, 3).map(cert => (
              <div key={cert._id} className="card">
                {/* Image / Banner */}
                <div style={{
                  height: '180px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#FCE7E9'
                }}>
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(135deg, #FEF2F2, #FCE7E9)'
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <span style={{
                    background: '#FEF2F2', color: '#DC2626',
                    fontSize: '0.7rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '20px'
                  }}>
                    {cert.issuer}
                  </span>
                  <h3 style={{
                    marginTop: '0.75rem', fontWeight: 700,
                    color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.5rem'
                  }}>
                    {cert.title}
                  </h3>
                  <p style={{
                    color: 'var(--gray-500)', fontSize: '0.88rem',
                    lineHeight: 1.6, marginBottom: '1rem'
                  }}>
                    {cert.description}
                  </p>
                  <div style={{
                    fontSize: '0.8rem', color: 'var(--gray-400)'
                  }}>
                    📅 {cert.yearBS}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <NavLink to="/awards" onClick={handleNavClick} className="btn btn-outline btn-lg">
              View All Awards →
            </NavLink>
          </div>
        </div>
      </section>

      {/* ---- PRESIDENT MESSAGE ---- */}
      <section className="section" style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px', height: '160px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '4rem', margin: '0 auto 1rem'
              }}><img src="/president.jpeg" alt="" style={{width: '160px', height: '160px', borderRadius: '50%'}} /></div>
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
              <NavLink to="/about" onClick={handleNavClick} className="btn" style={{ background: 'white', color: '#C8102E', border: '2px solid white', fontWeight: 700 }}>
                Read More About Us →
              </NavLink>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section div[style*="auto 1fr"]{grid-template-columns:1fr!important;text-align:center;}}`}</style>
      </section>

      {/* ---- CTA ---- */}
      <section className="section-sm" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
            Be Part of Our Journey
          </h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Join Fulbari Yuba Club Jakma and become part of a growing community of young sportspersons.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <NavLink to="/contact" onClick={handleNavClick} className="btn btn-primary btn-lg">Contact Us</NavLink>
            <a href="https://www.facebook.com/profile.php?id=100084950064757" target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">Follow on Facebook</a>
          </div>
        </div>
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
              .sponsor-card {
                flex: 0 0 calc(33.333% - 1.2rem);
                max-width: calc(33.333% - 1.2rem);
              }
            }
            @media (max-width: 640px) {
              .sponsor-card {
                flex: 0 0 calc(50% - 0.75rem);
                max-width: calc(50% - 0.75rem);
              }
              .sponsors-grid {
                gap: 1rem;
              }
            }
            @media (max-width: 360px) {
              .sponsor-card {
                flex: 0 0 100%;
                max-width: 100%;
              }
            }
          `}</style>
        </section>
      )}

    </div>
  );
};

export default HomePage;