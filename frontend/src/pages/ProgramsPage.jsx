import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostProgramModal } from '../components/PostModals.jsx';
import { STATIC_PROGRAMS } from '../data/programs.js';
import API from '../utils/api';

const CATS = [
  { key: 'all',        label: 'All Programs', icon: '📋' },
  { key: 'tournament', label: 'Tournaments',  icon: '⚽' },
  { key: 'community',  label: 'Community',    icon: '🤝' },
  { key: 'cultural',   label: 'Cultural',     icon: '🎭' },
  { key: 'training',   label: 'Training',     icon: '🏃' },
];

const CAT_STYLE = {
  tournament: { bg: '#FEF2F2', color: '#991B1B' },
  community:  { bg: '#F0FDF4', color: '#166534' },
  cultural:   { bg: '#FFF7ED', color: '#9A3412' },
  training:   { bg: '#EFF6FF', color: '#1E40AF' },
  other:      { bg: '#F9FAFB', color: '#374151' },
};

const STATUS_STYLE = {
  upcoming: { bg: '#FEF3C7', color: '#92400E', label: 'Upcoming' },
  active:   { bg: '#D1FAE5', color: '#065F46', label: 'Ongoing'   },
  past:     { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  draft:    { bg: '#DBEAFE', color: '#1E40AF', label: 'Draft'     },
};

const EMOJI = {
  tournament: '⚽',
  community:  '🤝',
  cultural:   '🎭',
  training:   '🏃',
  other:      '📌',
};

// Resolve cover image from either DB format ({ url }) or static format (plain string)
const resolveCover = (p) =>
  p.coverImage?.url ||
  (typeof p.coverImage === 'string' ? p.coverImage : null) ||
  p.photos?.[0]?.url ||
  (typeof p.image === 'string' ? p.image : null) ||
  null;

const isWithin5Days = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 5;
};

// ─── Program Card ─────────────────────────────────────────────────────────────
const ProgramCard = ({ p, isAdmin, onDelete }) => {
  const cat      = CAT_STYLE[p.category] || CAT_STYLE.other;
  const st       = STATUS_STYLE[p.status] || STATUS_STYLE.past;
  const catLabel = CATS.find(c => c.key === p.category)?.label || p.category;
  const cover    = resolveCover(p);
  const isStatic = String(p._id).startsWith('static_');
  const canDelete = isAdmin && !isStatic && isWithin5Days(p.createdAt);
  const tooOld    = isAdmin && !isStatic && !isWithin5Days(p.createdAt);

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Banner area ── */}
      <div style={{
        height: '220px',
        position: 'relative',
        overflow: 'hidden',
        // Only show gradient bg when there's no image
        background: cover ? 'transparent' : 'linear-gradient(135deg,#FEF2F2,#FCE7E9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {cover ? (
          <img
            src={cover}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>
            {EMOJI[p.category] || '📌'}
          </span>
        )}

        {/* Status badge — always visible over image or emoji bg */}
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          background: st.bg, color: st.color,
          fontSize: '0.7rem', fontWeight: 700,
          padding: '4px 10px', borderRadius: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          {st.label}
        </span>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '1.5rem' }}>
        <span style={{
          background: cat.bg, color: cat.color,
          fontSize: '0.7rem', fontWeight: 700,
          padding: '3px 10px', borderRadius: '20px',
        }}>
          {catLabel}
        </span>

        <h3 style={{
          marginTop: '0.75rem', fontWeight: 700,
          color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.6rem',
        }}>
          {p.title}
        </h3>

        <p style={{
          color: 'var(--gray-500)', fontSize: '0.88rem',
          lineHeight: 1.6, marginBottom: '1rem',
        }}>
          {p.shortDesc}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', marginBottom: '1rem' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
          <span>📍 {p.location}</span>
          <span>📅 {new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        {p.participants && (
          <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
            👥 {p.participants} participants
          </div>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(p._id, p.createdAt)}
            style={{
              marginTop: '1rem', background: '#FEF2F2', color: '#C8102E',
              border: '1px solid #FECACA', borderRadius: '6px',
              padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            Delete
          </button>
        )}
        {tooOld && (
          <div style={{
            marginTop: '0.75rem', background: '#F9FAFB',
            border: '1px solid var(--gray-200)', borderRadius: '6px',
            padding: '5px 10px', fontSize: '0.72rem', color: 'var(--gray-400)',
            textAlign: 'center', lineHeight: 1.4,
          }}>
            🔒 Locked (older than 5 days)
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Programs Page ────────────────────────────────────────────────────────────
const ProgramsPage = () => {
  const { isAdmin } = useAuth();

  // Initialize with static data — DB items merged on top when available
  const [programs, setPrograms] = useState(STATIC_PROGRAMS);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    API.get('/programs?limit=50')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          const dbIds = new Set(data.map(d => d._id));
          const merged = [
            ...data,
            ...STATIC_PROGRAMS.filter(s => !dbIds.has(s._id)),
          ];
          setPrograms(merged);
        }
        // If DB empty, keep STATIC_PROGRAMS (already set as initial state)
      })
      .catch(() => {}) // Static data already shown
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (p) => setPrograms(prev => [p, ...prev]);

  const handleDelete = async (id, createdAt) => {
    if (!isWithin5Days(createdAt)) {
      setDeleteError('This program is older than 5 days and cannot be deleted.');
      setTimeout(() => setDeleteError(''), 5000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await API.delete(`/programs/${id}`);
      setPrograms(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      setDeleteError(e.response?.data?.message || 'Delete failed');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  const list = programs.filter(p => filter === 'all' || p.category === filter);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Activities & Events
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0 1rem' }}>
            Programs & Events
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto' }}>
            All activities, tournaments, and community events organized by Fulbari Yuba Club Jakma
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">

          {deleteError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B',
              padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem',
              fontWeight: 600, fontSize: '0.88rem',
            }}>
              ⚠️ {deleteError}
            </div>
          )}

          {/* Filter tabs + Admin button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap',
              background: 'white', padding: '8px', borderRadius: '12px',
              border: '1px solid var(--gray-200)', width: 'fit-content',
            }}>
              {CATS.map(c => (
                <button key={c.key} onClick={() => setFilter(c.key)} style={{
                  padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.85rem',
                  background: filter === c.key ? '#C8102E' : 'transparent',
                  color: filter === c.key ? 'white' : 'var(--gray-600)',
                  transition: 'all 0.2s',
                }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Add Program
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <span className="icon">📭</span>
              <p>No programs found</p>
            </div>
          ) : (
            <div className="grid-3">
              {list.map(p => (
                <ProgramCard key={p._id} p={p} isAdmin={isAdmin} onDelete={handleDelete} />
              ))}
            </div>
          )}

        </div>
      </section>

      {showModal && (
        <PostProgramModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />
      )}
    </div>
  );
};

export default ProgramsPage;