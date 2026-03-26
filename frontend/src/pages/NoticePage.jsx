import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostNoticeModal } from '../components/PostModals.jsx';
import { STATIC_NOTICES } from '../data/notices.js';
import API from '../utils/api.js';

const CAT_STYLE = {
  general:  { bg: '#F0F9FF', color: '#0369A1', label: 'General' },
  event:    { bg: '#FFF7ED', color: '#C2410C', label: 'Event' },
  urgent:   { bg: '#FFF1F2', color: '#BE123C', label: 'Urgent' },
  meeting:  { bg: '#F5F3FF', color: '#6D28D9', label: 'Meeting' },
  sports:   { bg: '#FEF2F2', color: '#991B1B', label: 'Sports' },
};

const PRIORITY_STYLE = {
  high:   { bg: '#FEF2F2', color: '#C8102E', label: '🔴 High Priority', border: '#C8102E' },
  normal: { bg: '#FFFBEB', color: '#92400E', label: '🟡 Normal',        border: '#F59E0B' },
  low:    { bg: '#F0FDF4', color: '#166534', label: '🟢 Low Priority',  border: '#22C55E' },
};

const isWithin5Days = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 5;
};

// --- Expandable Notice Card ---
const NoticeCard = ({ notice, isAdmin, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isStatic  = String(notice._id).startsWith('static_');
  const canDelete = isAdmin && !isStatic && isWithin5Days(notice.createdAt);
  const tooOld    = isAdmin && !isStatic && !isWithin5Days(notice.createdAt);
  const cat       = CAT_STYLE[notice.category]  || CAT_STYLE.general;
  const pri       = PRIORITY_STYLE[notice.priority] || PRIORITY_STYLE.normal;
  const preview   = notice.body?.length > 160 ? notice.body.slice(0, 160) + '…' : notice.body;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid var(--gray-200)',
      borderLeft: `4px solid ${pri.border}`,
      boxShadow: notice.featured ? '0 4px 20px rgba(200,16,46,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ padding: '1.25rem 1.5rem' }}>

        {/* Top row: badges + date */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.6rem', alignItems: 'center' }}>
              {notice.featured && (
                <span style={{ background: '#FEF2F2', color: '#C8102E', fontSize: '0.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', border: '1px solid #FECACA' }}>
                  📌 Pinned
                </span>
              )}
              <span style={{ background: cat.bg, color: cat.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: '20px' }}>
                {cat.label}
              </span>
              <span style={{ background: pri.bg, color: pri.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 9px', borderRadius: '20px' }}>
                {pri.label}
              </span>
            </div>
            <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', lineHeight: 1.35, margin: 0 }}>
              {notice.title}
            </h3>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
              📅 {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '2px' }}>
              ✍️ {notice.author}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
            {expanded ? notice.body : preview}
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          {notice.body?.length > 160 ? (
            <button
              onClick={() => setExpanded(p => !p)}
              style={{ background: 'none', border: 'none', color: '#C8102E', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', padding: 0, fontFamily: 'var(--font)' }}
            >
              {expanded ? '▲ Show Less' : '▼ Read Full Notice'}
            </button>
          ) : <span />}

          <div style={{ display: 'flex', gap: '8px' }}>
            {canDelete && (
              <button
                onClick={() => onDelete(notice._id, notice.createdAt)}
                style={{ background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECACA', borderRadius: '6px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
              >
                Delete
              </button>
            )}
            {tooOld && (
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', padding: '4px 8px', background: '#F9FAFB', border: '1px solid var(--gray-200)', borderRadius: '6px' }}>
                🔒 Locked
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
const NoticePage = () => {
  const { isAdmin } = useAuth();

  const [notices, setNotices]       = useState(STATIC_NOTICES);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [showModal, setShowModal]   = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    API.get('/notices')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          const dbIds = new Set(data.map(d => d._id));
          const merged = [
            ...data,
            ...STATIC_NOTICES.filter(s => !dbIds.has(s._id)),
          ];
          setNotices(merged);
        }
        // If DB is empty, STATIC_NOTICES (initial state) already shows
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (n) => setNotices(prev => [n, ...prev]);

  const handleDelete = async (id, createdAt) => {
    if (!isWithin5Days(createdAt)) {
      setDeleteError('This notice is older than 5 days and cannot be deleted.');
      setTimeout(() => setDeleteError(''), 5000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/notices/${id}`);
      setNotices(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      setDeleteError(e.response?.data?.message || 'Delete failed');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  const FILTER_CATS = ['all', 'general', 'event', 'urgent', 'meeting', 'sports'];

  // Pinned first, then sorted newest-first
  const filtered = notices
    .filter(n => filter === 'all' || n.category === filter)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const highPriority = filtered.filter(n => n.priority === 'high');
  const others       = filtered.filter(n => n.priority !== 'high');

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Official Communications
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>
            Notice Board
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Important announcements and updates from FYC Jakma</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>

          {deleteError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
              ⚠️ {deleteError}
            </div>
          )}

          {/* Filter bar + Admin button */}
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
                  {f === 'all' ? 'All Notices' : CAT_STYLE[f]?.label || f}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Post Notice
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontWeight: 600 }}>No notices found.</p>
            </div>
          ) : (
            <>
              {/* High priority section */}
              {highPriority.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{ height: '2px', flex: 1, background: '#FECACA' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C8102E', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      🔴 High Priority
                    </span>
                    <div style={{ height: '2px', flex: 1, background: '#FECACA' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {highPriority.map(n => (
                      <NoticeCard key={n._id} notice={n} isAdmin={isAdmin} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other notices */}
              {others.length > 0 && (
                <div>
                  {highPriority.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                      <div style={{ height: '2px', flex: 1, background: 'var(--gray-200)' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        Other Notices
                      </span>
                      <div style={{ height: '2px', flex: 1, background: 'var(--gray-200)' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {others.map(n => (
                      <NoticeCard key={n._id} notice={n} isAdmin={isAdmin} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {showModal && (
        <PostNoticeModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />
      )}
    </div>
  );
};

export default NoticePage;