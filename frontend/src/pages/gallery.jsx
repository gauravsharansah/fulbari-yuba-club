import React, { useEffect, useState } from 'react';
//import { useLang } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PostGalleryModal } from '../components/PostModals.jsx';
import API from '../utils/api.js';

const EMOJIS = ['⚽', '🏆', '👥', '🎭', '🏅', '🌄', '🤝', '🎯', '🏋️', '🎪', '🌸', '🏃'];
const CATS = ['all', 'match', 'event', 'training', 'community', 'cultural'];

const GalleryPage = () => {
  const { t } = useLang();
  const { isAdmin } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get('/gallery')
      .then(r => setPhotos(r.data.data || []))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (newPhotos) => {
    setPhotos(prev => [...(Array.isArray(newPhotos) ? newPhotos : [newPhotos]), ...prev]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await API.delete(`/gallery/${id}`);
      setPhotos(prev => prev.filter(p => p._id !== id));
    } catch {}
  };

  const list = photos.filter(p => filter === 'all' || p.category === filter);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{t('gallery_tag')}</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>{t('gallery_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>{t('gallery_subtitle')}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding: '7px 14px', borderRadius: '30px',
                  border: filter === c ? 'none' : '1.5px solid var(--gray-200)',
                  cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem',
                  background: filter === c ? '#C8102E' : 'white',
                  color: filter === c ? 'white' : 'var(--gray-600)',
                  transition: 'all 0.2s',
                }}>
                  {c === 'all' ? t('all_photos') : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('add_photos_btn')}</button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : list.length === 0 && photos.length === 0 ? (
            // Show placeholder emojis when no photos yet
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {EMOJIS.map((e, i) => (
                <div key={i} style={{
                  aspectRatio: '1', background: 'white', border: '1px solid var(--gray-200)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', transition: 'transform 0.2s',
                }}
                  onMouseEnter={e2 => e2.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e2 => e2.currentTarget.style.transform = 'scale(1)'}
                >{e}</div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {list.map(photo => (
                <div key={photo._id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gray-200)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'FYC Photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onClick={() => setSelected(photo)}
                  />
                  {isAdmin && (
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div style={{ maxWidth: '800px', width: '100%', borderRadius: '12px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption} style={{ width: '100%', display: 'block' }} />
            {selected.caption && (
              <div style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, background: 'white' }}>{selected.caption}</div>
            )}
          </div>
        </div>
      )}

      {showModal && <PostGalleryModal onClose={() => setShowModal(false)} onSuccess={handleAdd} />}
    </div>
  );
};

export default GalleryPage;
