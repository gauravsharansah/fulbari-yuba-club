import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { PostGalleryModal } from '../components/PostModals.jsx';
import { STATIC_GALLERY } from '../data/gallery.js';
import API from '../utils/api.js';

const EMOJIS = ['⚽', '🏆', '👥', '🎭', '🏅', '🌄', '🤝', '🎯', '🏋️', '🎪', '🌸', '🏃'];
const CATS = ['all', 'match', 'event', 'training', 'community', 'cultural'];

const GalleryPage = () => {
  const { isAdmin } = useAuth();

  // Initialize with static data so gallery always shows something,
  // same pattern as AwardsPage with STATIC_CERTIFICATES.
  const [photos, setPhotos] = useState(STATIC_GALLERY);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get('/gallery')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          // DB items first, then static items not already in DB
          const dbIds = new Set(data.map(d => d._id));
          const merged = [
            ...data,
            ...STATIC_GALLERY.filter(s => !dbIds.has(s._id)),
          ];
          setPhotos(merged);
        }
        // If DB empty, keep STATIC_GALLERY (already set as initial state)
      })
      .catch(() => {}) // Static data already shown on error
      .finally(() => setLoading(false));
  }, []);

  // Filter photos by selected category
  const list = photos.filter(p => filter === 'all' || p.category === filter);

  const handleAdd = (newPhotos) => {
    setPhotos(prev => [...(Array.isArray(newPhotos) ? newPhotos : [newPhotos]), ...prev]);
  };

  const handleDelete = async (id) => {
    // Prevent deleting static fallback entries
    if (String(id).startsWith('static_')) return;
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      setPhotos(prev => prev.filter(p => p._id !== id));
      if (selected && selected._id === id) setSelected(null);
    } catch {}
  };

  const openLightbox = (photo, index) => {
    setSelected(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelected(null);
    setSelectedIndex(null);
  };

  const goNext = (e) => {
    e.stopPropagation();
    if (selectedIndex === null || list.length === 0) return;
    const next = (selectedIndex + 1) % list.length;
    setSelected(list[next]);
    setSelectedIndex(next);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    if (selectedIndex === null || list.length === 0) return;
    const prev = (selectedIndex - 1 + list.length) % list.length;
    setSelected(list[prev]);
    setSelectedIndex(prev);
  };

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext(e);
      if (e.key === 'ArrowLeft') goPrev(e);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, selectedIndex, list]);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Photos</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Our Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Moments from Fulbari Yuba Club Jakma</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">

          {/* Top bar: filters + add button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATS.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: '7px 14px', borderRadius: '30px',
                    border: filter === c ? 'none' : '1.5px solid var(--gray-200)',
                    cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem',
                    background: filter === c ? '#C8102E' : 'white',
                    color: filter === c ? 'white' : 'var(--gray-600)',
                    transition: 'all 0.2s',
                  }}
                >
                  {c === 'all' ? 'All Photos' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Photos</button>
            )}
          </div>

          {/* Photo count indicator */}
          {!loading && photos.length > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
              Showing <strong>{list.length}</strong> {list.length === 1 ? 'photo' : 'photos'}
              {filter !== 'all' && <> in <strong>{filter.charAt(0).toUpperCase() + filter.slice(1)}</strong></>}
            </p>
          )}

          {/* States: loading / no data placeholder / empty filter / photo grid */}
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>

          ) : photos.length === 0 ? (
            // No photos at all — show emoji placeholders
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {EMOJIS.map((e, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1', background: 'white', border: '1px solid var(--gray-200)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e2 => e2.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e2 => e2.currentTarget.style.transform = 'scale(1)'}
                >
                  {e}
                </div>
              ))}
            </div>

          ) : list.length === 0 ? (
            // Photos exist but none match the current filter
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No photos in this category</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Try selecting a different category or add photos to <strong>{filter}</strong>.
              </p>
              <button
                onClick={() => setFilter('all')}
                style={{
                  marginTop: '1rem', padding: '8px 20px', borderRadius: '30px',
                  background: '#C8102E', color: 'white', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font)',
                }}
              >
                View All Photos
              </button>
            </div>

          ) : (
            // Photo grid with captions
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {list.map((photo, index) => {
                const isStatic = String(photo._id).startsWith('static_');
                const canDelete = isAdmin && !isStatic;

                return (
                  <div
                    key={photo._id}
                    onClick={() => openLightbox(photo, index)}
                    style={{
                      position: 'relative', borderRadius: '12px', overflow: 'hidden',
                      border: '1px solid var(--gray-200)', cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s', background: 'white',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Photo */}
                    <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                      <img
                        src={photo.url}
                        alt={photo.caption || 'FYC Photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Caption bar */}
                    {photo.caption && (
                      <div style={{
                        padding: '8px 10px', fontSize: '0.78rem', fontWeight: 600,
                        color: 'var(--gray-700)', fontFamily: 'var(--font)',
                        background: 'white', borderTop: '1px solid var(--gray-100)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {photo.caption}
                      </div>
                    )}

                    {/* Category badge */}
                    {photo.category && photo.category !== 'all' && (
                      <div style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: 'rgba(123,10,26,0.85)', color: 'white',
                        fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font)',
                        padding: '2px 7px', borderRadius: '20px',
                        textTransform: 'capitalize', letterSpacing: '0.03em',
                      }}>
                        {photo.category}
                      </div>
                    )}

                    {/* Admin delete — only for DB photos, not static */}
                    {canDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}
                        style={{
                          position: 'absolute', top: '8px', right: '8px',
                          background: 'rgba(200,16,46,0.9)', color: 'white',
                          border: 'none', borderRadius: '6px', padding: '4px 8px',
                          fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                          fontFamily: 'var(--font)',
                        }}
                      >🗑</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 8000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
        >
          <button onClick={closeLightbox} style={{ position: 'absolute', top: '16px', right: '20px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

          {list.length > 1 && (
            <button onClick={goPrev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          )}

          <div
            style={{ maxWidth: '820px', width: '100%', borderRadius: '14px', overflow: 'hidden', background: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.caption || 'FYC Photo'}
              style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain', background: '#111' }}
            />
            {(selected.caption || selected.category) && (
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                {selected.caption
                  ? <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-800)', fontFamily: 'var(--font)' }}>{selected.caption}</span>
                  : <span />
                }
                {selected.category && selected.category !== 'all' && (
                  <span style={{ background: '#C8102E', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {selected.category}
                  </span>
                )}
              </div>
            )}
          </div>

          {list.length > 1 && (
            <button onClick={goNext} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          )}

          {list.length > 1 && (
            <div style={{ position: 'absolute', bottom: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontFamily: 'var(--font)' }}>
              {selectedIndex + 1} / {list.length}
            </div>
          )}
        </div>
      )}

      {showModal && <PostGalleryModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />}
    </div>
  );
};

export default GalleryPage;