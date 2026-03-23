import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div style={{ paddingTop: 'var(--navbar-h)' }}>

    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '64px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Our Story</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0 1rem' }}>
          About Fulbari Yuba Club Jakma
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
          फुलबारी युवा क्लव जाक्मा — Est. 2057 BS
        </p>
      </div>
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
              Fulbari Yuba Club Jakma (F.Y.C) is a dynamic youth football club established in <strong>2057 BS</strong> in the beautiful locality of Jakma, Manyavangyag Gaun Palika-6, Okhaldhunga, Nepal.
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
                { label: 'Facebook', value: '434 Followers' },
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

    {/* President */}
    <section className="section" style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Leadership</span>
          <h2 className="section-title">Executive Committee</h2>
        </div>
        <div className="grid-4">
          {[
            { name: 'Amrit Bahadur Rai', pos: 'President', since: '2075 BS' },
            { name: 'Vice President', pos: 'Vice President', since: 'Executive Committee' },
            { name: 'General Secretary', pos: 'General Secretary', since: 'Executive Committee' },
            { name: 'Treasurer', pos: 'Finance & Treasurer', since: 'Executive Committee' },
          ].map((m, i) => (
            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8102E,#9B0B22)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'white' }}>👤</div>
              <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{m.name}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>{m.pos}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{m.since}</div>
            </div>
          ))}
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
        <Link to="/contact" className="btn btn-lg" style={{ background: 'white', color: '#C8102E', border: '2px solid white', fontWeight: 700 }}>
          Get In Touch
        </Link>
      </div>
    </section>

  </div>
);

export default AboutPage;
