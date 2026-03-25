import React, { useEffect, useState } from 'react';
//import { useLang } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PostProgramModal } from '../components/PostModals.jsx';
import { STATIC_PROGRAMS } from '../data/programs.js';
import API from '../utils/api.js';

const CAT_STYLE = {
  tournament: { bg: '#FEF2F2', color: '#991B1B' },
  community: { bg: '#F0FDF4', color: '#166534' },
  cultural: { bg: '#FFF7ED', color: '#9A3412' },
  training: { bg: '#EFF6FF', color: '#1E40AF' },
  other: { bg: '#F9FAFB', color: '#374151' },
};
const STATUS_STYLE = {
  upcoming: { bg: '#FEF3C7', color: '#92400E' },
  active: { bg: '#D1FAE5', color: '#065F46' },
  past: { bg: '#F3F4F6', color: '#6B7280' },
  draft: { bg: '#DBEAFE', color: '#1E40AF' },
};
const EMOJI = { tournament: '⚽', community: '🤝', cultural: '🎭', training: '🏃', other: '📌' };

const isWithin5Days = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 5;
};

const ProgramsPage = () => {
  //const { t, lang } = useLang();
  const { isAdmin } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const CATS = [
    { key: 'all', label: t('filter_all') },
    { key: 'tournament', label: t('filter_tournament') },
    { key: 'community', label: t('filter_community') },
    { key: 'cultural', label: t('filter_cultural') },
    { key: 'training', label: t('filter_training') },
  ];

  useEffect(() => {
    API.get('/programs?limit=50')
      .then(r => {
        const data = r.data.data || [];
        setPrograms(data.length > 0 ? data : STATIC_PROGRAMS);
      })
      .catch(() => setPrograms(STATIC_PROGRAMS))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (p) => setPrograms(prev => [p, ...prev]);

  const handleDelete = async (id, createdAt) => {
    if (!isWithin5Days(createdAt)) {
      setDeleteError(t('delete_disabled_title'));
      setTimeout(() => setDeleteError(''), 5000);
      return;
    }
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await API.delete(`/programs/${id}`);
      setPrograms(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      const msg = e.response?.data?.message || 'Delete failed';
      setDeleteError(msg);
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  // Get translated field from item — checks for _np suffix when in Nepali
  const getField = (item, field) => {
    if (lang === 'np' && item[`${field}_np`]) return item[`${field}_np`];
    return item[field] || '';
  };

  const getCatLabel = (key) => {
    const m = {
      tournament: t('cat_tournament'), community: t('cat_community'),
      cultural: t('cat_cultural'), training: t('cat_training'), other: t('cat_other'),
    };
    return m[key] || key;
  };

  const getStatusLabel = (key) => {
    const m = {
      upcoming: t('status_upcoming'), active: t('status_active'),
      past: t('status_past'), draft: t('status_draft'),
    };
    return m[key] || key;
  };

  const list = programs.filter(p => filter === 'all' || p.category === filter);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            {t('prog_hero_tag')}
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0 1rem' }}>
            {t('prog_hero_title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px', margin: '0 auto' }}>
            {t('prog_hero_sub')}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">

          {/* Delete error banner */}
          {deleteError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
              ⚠️ {deleteError}
            </div>
          )}

          {/* Filters + Add button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
              {CATS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  style={{
                    padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.84rem',
                    background: filter === c.key ? '#C8102E' : 'transparent',
                    color: filter === c.key ? 'white' : 'var(--gray-600)',
                    transition: 'all 0.2s',
                  }}
                >{c.label}</button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                {t('prog_add_btn')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : list.length === 0 ? (
            <div className="empty-state"><span className="icon">📭</span><p>{t('prog_empty')}</p></div>
          ) : (
            <div className="grid-3">
              {list.map(p => {
                const cat = CAT_STYLE[p.category] || CAT_STYLE.other;
                const st = STATUS_STYLE[p.status] || STATUS_STYLE.past;
                const canDelete = isAdmin && isWithin5Days(p.createdAt);
                const tooOld = isAdmin && !isWithin5Days(p.createdAt);

                return (
                  <div key={p._id} className="card">
                    {/* Card image */}
                    <div style={{ height: '180px', background: 'linear-gradient(135deg,#FEF2F2,#FCE7E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {p.photos?.[0]?.url ? (
                        <img src={p.photos[0].url} alt={getField(p, 'title')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>{EMOJI[p.category] || '📌'}</span>
                      )}
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                        {getStatusLabel(p.status)}
                      </span>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '1.5rem' }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                        {getCatLabel(p.category)}
                      </span>
                      <h3 style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.6rem' }}>
                        {getField(p, 'title')}
                      </h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {getField(p, 'shortDesc')}
                      </p>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', marginBottom: '1rem' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray-400)', flexWrap: 'wrap', gap: '4px' }}>
                        <span>📍 {p.location}</span>
                        <span>📅 {new Date(p.date).toLocaleDateString(lang === 'np' ? 'ne-NP' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {p.participants && (
                        <div style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                          👥 {p.participants} {t('prog_participants')}
                        </div>
                      )}

                      {/* Admin: delete if within 5 days */}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(p._id, p.createdAt)}
                          style={{ marginTop: '0.75rem', background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECACA', borderRadius: '6px', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', width: '100%' }}
                        >
                          {t('delete_btn')}
                        </button>
                      )}
                      {/* Admin: locked if older than 5 days */}
                      {tooOld && (
                        <div
                          style={{ marginTop: '0.75rem', background: '#F9FAFB', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.4 }}
                          title={t('delete_disabled_title')}
                        >
                          🔒 {t('delete_disabled_title')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <PostProgramModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAdd}
        />
      )}
    </div>
  );
};

export default ProgramsPage;
