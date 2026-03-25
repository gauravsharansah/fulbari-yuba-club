import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostBlogModal } from '../components/PostModals.jsx';
import { STATIC_BLOGS } from '../data/blogs.js';
import API from '../utils/api.js';

const CAT_STYLE = {
  news:         { bg: '#EFF6FF', color: '#1E40AF' },
  match:        { bg: '#FEF2F2', color: '#991B1B' },
  announcement: { bg: '#FEF3C7', color: '#92400E' },
  community:    { bg: '#F0FDF4', color: '#166534' },
  achievement:  { bg: '#FDF4FF', color: '#7E22CE' },
};

const CAT_LABEL = {
  news: 'News', match: 'Match', announcement: 'Announcement',
  community: 'Community', achievement: 'Achievement',
};

const isWithin5Days = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 5;
};

const BlogPage = () => {
  const { isAdmin } = useAuth();

  // ✅ FIX: Initialize with static data. Merge DB data on top — never replace.
  const [blogs, setBlogs] = useState(STATIC_BLOGS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    API.get('/blogs')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          const dbIds = new Set(data.map(d => d._id));
          const merged = [
            ...data,
            ...STATIC_BLOGS.filter(s => !dbIds.has(s._id)),
          ];
          setBlogs(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (b) => setBlogs(prev => [b, ...prev]);

  const handleDelete = async (id, createdAt) => {
    if (!isWithin5Days(createdAt)) {
      setDeleteError('This post is older than 5 days and cannot be deleted.');
      setTimeout(() => setDeleteError(''), 5000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (e) {
      setDeleteError(e.response?.data?.message || 'Delete failed');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  const FILTER_CATS = ['all', 'news', 'match', 'announcement', 'community', 'achievement'];
  const list = blogs.filter(b => filter === 'all' || b.category === filter);
  const featured = list.find(b => b.featured) || list[0];
  const rest = list.filter(b => b._id !== featured?._id);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Club News & Updates
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>
            Blog & Announcements
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Latest news, match reports, and club updates</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {deleteError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
              ⚠️ {deleteError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FILTER_CATS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '7px 14px', borderRadius: '30px',
                    border: filter === f ? 'none' : '1.5px solid var(--gray-200)',
                    cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem',
                    background: filter === f ? '#C8102E' : 'white',
                    color: filter === f ? 'white' : 'var(--gray-600)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'all' ? 'All Posts' : CAT_LABEL[f] || f}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + New Post
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <>
              {/* Featured blog */}
              {featured && (
                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                  <div style={{ minHeight: '260px', background: 'linear-gradient(135deg,#FEF2F2,#FCE7E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', overflow: 'hidden' }}>
                    {featured.coverImage?.url || featured.image
                      ? <img
                          src={featured.coverImage?.url || featured.image}
                          alt={featured.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      : '📰'}
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ background: '#FEF2F2', color: '#C8102E', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                        ⭐ Featured
                      </span>
                      <span style={{ background: CAT_STYLE[featured.category]?.bg, color: CAT_STYLE[featured.category]?.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                        {CAT_LABEL[featured.category] || featured.category}
                      </span>
                    </div>
                    <h2 style={{ fontWeight: 800, color: 'var(--gray-900)', fontSize: '1.3rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                      {featured.title}
                    </h2>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.92rem' }}>
                      {featured.summary}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                      ✍️ {featured.author} · 📅 {new Date(featured.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {isAdmin && !String(featured._id).startsWith('static_') && isWithin5Days(featured.createdAt) && (
                      <button onClick={() => handleDelete(featured._id, featured.createdAt)}
                        style={{ marginTop: '1rem', background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECACA', borderRadius: '6px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        Delete
                      </button>
                    )}
                    {isAdmin && !String(featured._id).startsWith('static_') && !isWithin5Days(featured.createdAt) && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--gray-400)' }}>
                        🔒 Locked (older than 5 days)
                      </div>
                    )}
                  </div>
                  <style>{`@media(max-width:640px){.card[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
                </div>
              )}

              {/* Rest of blogs */}
              <div className="grid-3">
                {rest.map(b => {
                  const cs = CAT_STYLE[b.category] || CAT_STYLE.news;
                  const isStatic  = String(b._id).startsWith('static_');
                  const canDelete = isAdmin && !isStatic && isWithin5Days(b.createdAt);
                  const tooOld    = isAdmin && !isStatic && !isWithin5Days(b.createdAt);
                  const imgSrc    = b.coverImage?.url || b.image || null;

                  return (
                    <div key={b._id} className="card">
                      <div style={{ height: '160px', background: 'linear-gradient(135deg,#F9FAFB,#F3F4F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', overflow: 'hidden' }}>
                        {imgSrc
                          ? <img src={imgSrc} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : '📄'}
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <span style={{ background: cs.bg, color: cs.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                          {CAT_LABEL[b.category] || b.category}
                        </span>
                        <h3 style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.5rem', fontSize: '1rem' }}>
                          {b.title}
                        </h3>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                          {b.summary}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: canDelete || tooOld ? '0.75rem' : 0 }}>
                          ✍️ {b.author} · 📅 {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        {canDelete && (
                          <button onClick={() => handleDelete(b._id, b.createdAt)}
                            style={{ background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECACA', borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', width: '100%' }}>
                            Delete
                          </button>
                        )}
                        {tooOld && (
                          <div style={{ background: '#F9FAFB', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.4 }}>
                            🔒 Locked (older than 5 days)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {showModal && (
        <PostBlogModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />
      )}
    </div>
  );
};

export default BlogPage;
