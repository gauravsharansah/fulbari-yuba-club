import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const STATIC_BLOGS = [
  { _id: '1', title: 'FYC Jakma Wins District Tournament — A Historic Moment', category: 'achievement', author: 'FYC Admin', createdAt: '2024-01-20', summary: 'Our boys brought home the trophy in a thrilling final against Siddhicharan FC in a match that will be remembered for years.', featured: true },
  { _id: '2', title: 'Annual General Meeting 2081 — Key Decisions & New Committee', category: 'news', author: 'Club Secretary', createdAt: '2024-01-10', summary: 'Highlights from the Annual General Meeting including new committee formation and club development plans for 2081 BS.' },
  { _id: '3', title: 'Summer Football Training Camp 2081 — Registrations Now Open', category: 'announcement', author: 'FYC Admin', createdAt: '2024-01-05', summary: 'Registrations are now open for the upcoming summer football training camp for players aged 10-18.' },
  { _id: '4', title: 'Blood Donation Drive Collects 50+ Units — A Community Victory', category: 'community', author: 'FYC Admin', createdAt: '2023-08-10', summary: 'Our community blood donation initiative was a massive success with over 50 units collected for local health facilities.' },
  { _id: '5', title: 'Meet Our New Coaching Staff for 2081 Season', category: 'news', author: 'Club President', createdAt: '2024-01-15', summary: 'FYC Jakma is proud to welcome three experienced coaches who will lead our training programs this season.' },
];
const CAT_STYLE = {
  news: { bg: '#EFF6FF', color: '#1E40AF', label: 'News' },
  match: { bg: '#FEF2F2', color: '#991B1B', label: 'Match Report' },
  announcement: { bg: '#FEF3C7', color: '#92400E', label: 'Announcement' },
  community: { bg: '#F0FDF4', color: '#166534', label: 'Community' },
  achievement: { bg: '#FDF4FF', color: '#7E22CE', label: 'Achievement' },
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/blogs').then(r => setBlogs(r.data.data || [])).catch(() => setBlogs(STATIC_BLOGS)).finally(() => setLoading(false));
  }, []);

  const list = (blogs.length > 0 ? blogs : STATIC_BLOGS).filter(b => filter === 'all' || b.category === filter);
  const featured = list.find(b => b.featured) || list[0];
  const rest = list.filter(b => b._id !== featured?._id);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>News & Stories</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Club Blog</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Latest news, match reports, and stories from FYC Jakma</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {/* Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {['all', 'news', 'match', 'announcement', 'community', 'achievement'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: '30px', border: filter === f ? 'none' : '1.5px solid var(--gray-200)',
                cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem',
                background: filter === f ? '#C8102E' : 'white',
                color: filter === f ? 'white' : 'var(--gray-600)',
                transition: 'all 0.2s'
              }}>
                {f === 'all' ? 'All Posts' : CAT_STYLE[f]?.label || f}
              </button>
            ))}
          </div>

          {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
            <>
              {/* Featured */}
              {featured && (
                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                  <div style={{ height: '100%', minHeight: '280px', background: 'linear-gradient(135deg,#FEF2F2,#FCE7E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
                    {featured.coverImage?.url ? (
                      <img src={featured.coverImage.url} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '📰'}
                  </div>
                  <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#FEF2F2', color: '#C8102E', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>Featured</span>
                      <span style={{ background: CAT_STYLE[featured.category]?.bg, color: CAT_STYLE[featured.category]?.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                        {CAT_STYLE[featured.category]?.label || featured.category}
                      </span>
                    </div>
                    <h2 style={{ fontWeight: 800, color: 'var(--gray-900)', fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '1rem' }}>{featured.title}</h2>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{featured.summary}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--gray-400)', flexWrap: 'wrap' }}>
                      <span>✍️ {featured.author}</span>
                      <span>📅 {new Date(featured.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <style>{`@media(max-width:640px){.card[style*="1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
                </div>
              )}

              {/* Rest */}
              <div className="grid-3">
                {rest.map(b => {
                  const cs = CAT_STYLE[b.category] || CAT_STYLE.news;
                  return (
                    <div key={b._id} className="card">
                      <div style={{ height: '140px', background: 'linear-gradient(135deg,#F9FAFB,#F3F4F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        {b.coverImage?.url ? <img src={b.coverImage.url} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📄'}
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <span style={{ background: cs.bg, color: cs.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{cs.label}</span>
                        <h3 style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.6rem', fontSize: '1rem' }}>{b.title}</h3>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{b.summary}</p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                          ✍️ {b.author} · 📅 {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
