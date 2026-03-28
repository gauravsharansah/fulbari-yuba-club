import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    //setMobileOpen(false);
    //setUserMenuOpen(false);
  };

// --- Executive Committee ---
const EXECUTIVES = [
  { _id: 'e1', name: 'Amrit Bahadur Rai', position: 'President', image: '/president.jpeg' },
  { _id: 'e2', name: 'Club Vice President', position: 'Vice President', image: null },
  { _id: 'e3', name: 'General Secretary', position: 'General Secretary', image: null },
  { _id: 'e4', name: 'Treasurer', position: 'Treasurer', image: null },
];

// --- Reusable Member Card ---
const MemberCard = ({ member, showJersey = false }) => (
  <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
    {member.image ? (
      <img
        src={member.image}
        alt={member.name}
        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid #FCE7E9' }}
      />
    ) : (
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#C8102E,#9B0B22)',
        margin: '0 auto 1rem', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.8rem', color: 'white',
        border: '3px solid #FCE7E9', fontWeight: 700,
      }}>
        {member.name[0]?.toUpperCase()}
      </div>
    )}
    <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{member.name}</div>
    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#C8102E' }}>
      {member.position}{showJersey && member.jerseyNumber ? ` · #${member.jerseyNumber}` : ''}
    </div>
  </div>
);

// --- Section Header ---
const SectionHeader = ({ title }) => (
  <h2 style={{
    fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)',
    marginBottom: '1.5rem', paddingBottom: '0.75rem',
    borderBottom: '3px solid #C8102E', display: 'inline-block',
  }}>
    {title}
  </h2>
);

const AboutPage = () => (
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
                Manyavangyag-6, Jakma, Okhaldhunga
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
              <Link to="/awards" className="btn btn-lg" style={{
                background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)'
              }}>Achievements</Link>
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

    {/* Main About */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-tag">फुलबारी युवा क्लव</span>
            <h2 style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--gray-900)', margin: '0.75rem 0 1.5rem', lineHeight: 1.2 }}>
              A Club Built on Passion &amp; Community
            </h2>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Fulbari Yuba Club Jakma (F.Y.C) is a dynamic youth football club established in <strong>2057 BS</strong> in the beautiful locality of Manyavangyag Gaun Palika-6, Jakma, Okhaldhunga, Nepal.
            </p>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Founded with the vision of nurturing local football talent and fostering community development, FYC has grown into one of the most respected youth organizations in Okhaldhunga district. We believe in the power of sports to unite people, build character, and create opportunities for the youth of our region.
            </p>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Over the years, the club has organized numerous tournaments, cultural programs, community events, and social initiatives that have positively impacted hundreds of families across Manyavangyag rural municipality.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Founded', value: '2057 BS (Nepal)' },
                { label: 'Location', value: 'Jakma, Okhaldhunga' },
                { label: 'Category', value: 'Youth Football Club' },
                { label: 'Titles | Runner-Ups', value: '1 | 2' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#FEF2F2,#FCE7E9)',
              border: '6px solid #C8102E', margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(200,16,46,0.15)'
            }}>
              <img src="/logo.png" alt="FYC Logo" style={{ width: '260px', height: '260px', borderRadius: '50%', objectFit: 'cover' }}
                onError={e => { e.target.parentElement.innerHTML = `<span style="font-size:8rem">⚽</span>`; }} />
            </div>
            <div style={{ marginTop: '1.5rem', background: 'var(--primary-light)', borderRadius: '12px', padding: '1rem', display: 'inline-block' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>एफ. वाई. सी.</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '2px' }}>स्था: २०५७ · नेपाल</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){section div[style*="1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </section>

    {/* Mission Vision */}
    <section className="section" style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Purpose</span>
          <h2 className="section-title">Mission &amp; Vision</h2>
        </div>
        <div className="grid-2">
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.2rem' }}>🎯</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--gray-900)', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              To discover, nurture, and develop young football talent from the hills of Okhaldhunga while promoting youth leadership, social harmony, and community empowerment through sports and cultural activities.
            </p>
          </div>
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.2rem' }}>🔭</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--gray-900)', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              To become the premier youth football institution of Okhaldhunga district, producing nationally recognized players and fostering a culture of sportsmanship, unity, and positive change in our community.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">What We Stand For</span>
          <h2 className="section-title">Our Core Values</h2>
        </div>
        <div className="grid-4">
          {[
            { icon: '⚽', title: 'Sportsmanship', desc: 'Fair play, respect, and integrity on and off the field.' },
            { icon: '🤝', title: 'Unity', desc: 'Building strong bonds within the community through sport.' },
            { icon: '🌱', title: 'Development', desc: 'Continuous growth of youth skills and potential.' },
            { icon: '🏔️', title: 'Resilience', desc: 'The spirit of the hills — never giving up.' },
          ].map((v, i) => (
            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{v.icon}</div>
              <h4 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>{v.title}</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Executive Committee */}
    <section className="section" style={{ background: 'var(--gray-50)' }}>
      <div className="container">

        {/* Executive Committee */}
        <div style={{ marginBottom: '3.5rem' }}>
          <SectionHeader title="⚙️ Executive Committee" />
          <div className="grid-4">
            {EXECUTIVES.map(m => <MemberCard key={m._id} member={m} />)}
          </div>
        </div>

      </div>
    </section>

    {/* CTA */}
    <section className="section-sm" style={{ background: 'var(--primary)', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.8rem', marginBottom: '1rem' }}>Want to Join FYC Jakma?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
          Become part of our growing family of football enthusiasts and community builders.
        </p>
        <NavLink to="/contact" onClick={handleNavClick} className="btn btn-lg" style={{ background: 'white', color: '#C8102E', border: '2px solid white', fontWeight: 700 }}>
          Get In Touch
        </NavLink>
      </div>
    </section>

  </div>
);

export default AboutPage;
