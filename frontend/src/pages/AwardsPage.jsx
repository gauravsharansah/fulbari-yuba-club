import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostAwardModal } from '../components/PostModals.jsx';
import { STATIC_CERTIFICATES } from '../data/certificates.js';
import API from '../utils/api.js';

const isWithin5Days = (createdAt) => {
  if (!createdAt) return false;
  return (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 5;
};

const AwardsPage = () => {
  const { isAdmin } = useAuth();

  // ✅ FIX: Initialize with static data so it always shows.
  // When DB returns items, we MERGE them — DB items first, then any static
  // items not already saved in DB. This prevents static items disappearing.
  const [certs, setCerts] = useState(STATIC_CERTIFICATES);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    API.get('/certificates')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          const dbIds = new Set(data.map(d => d._id));
          const merged = [
            ...data,
            ...STATIC_CERTIFICATES.filter(s => !dbIds.has(s._id)),
          ];
          setCerts(merged);
        }
        // If DB empty, keep STATIC_CERTIFICATES (already set as initial state)
      })
      .catch(() => {}) // Static data already shown
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (c) => setCerts(prev => [c, ...prev]);

  const handleDelete = async (id, createdAt) => {
    if (!isWithin5Days(createdAt)) {
      setDeleteError('This award is older than 5 days and cannot be deleted.');
      setTimeout(() => setDeleteError(''), 5000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this award?')) return;
    try {
      await API.delete(`/certificates/${id}`);
      setCerts(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      setDeleteError(e.response?.data?.message || 'Delete failed');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            Honours & Achievements
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0 1rem' }}>
            Awards & Certificates
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Recognition of our club's achievements and milestones</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {deleteError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
              ⚠️ {deleteError}
            </div>
          )}

          {isAdmin && (
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Add Award
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {certs.map(c => {
                const isStatic = String(c._id).startsWith('static_');
                const canDelete = isAdmin && !isStatic && isWithin5Days(c.createdAt);
                const tooOld   = isAdmin && !isStatic && !isWithin5Days(c.createdAt);

                // Image: supports { url } object, plain string, or null
                const imgSrc = c.image?.url || (typeof c.image === 'string' ? c.image : null);

                return (
                  <div key={c._id} className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg,#C8102E,#E8304A)' }} />

                    {/* Image or emoji icon */}
                    {imgSrc ? (
                      <img src={imgSrc} alt={c.title} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon || '🏆'}</div>
                    )}

                    <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {c.title}
                    </h3>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#C8102E', marginBottom: '4px' }}>
                      {c.issuer}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>
                      {c.yearBS || c.yearAD}
                    </div>
                    {c.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                        {c.description}
                      </p>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c._id, c.createdAt)}
                        style={{ marginTop: '1rem', background: '#FEF2F2', color: '#C8102E', border: '1px solid #FECACA', borderRadius: '6px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}
                      >
                        Delete
                      </button>
                    )}
                    {tooOld && (
                      <div style={{ marginTop: '0.75rem', background: '#F9FAFB', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '5px 10px', fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.4 }}>
                        🔒 Locked (older than 5 days)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <PostAwardModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />
      )}
    </div>
  );
};

export default AwardsPage;
