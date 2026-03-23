import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'admin' ? 'admin' : 'member');
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = mode === 'register'
        ? await register(form.name, form.email, form.password, form.phone)
        : await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', border: '3px solid #C8102E' }}>
            <img src="/logo.png" alt="FYC" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.parentElement.style.background = '#C8102E'; e.target.parentElement.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-weight:800;font-size:1rem;">FYC</span>'; }} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)' }}>Fulbari Yuba Club</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>Jakma — F.Y.C Member Portal</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
            {['member', 'admin'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
                flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.85rem',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#C8102E' : 'var(--gray-500)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}>
                {t === 'admin' ? '🔐 Admin' : '👤 Member'}
              </button>
            ))}
          </div>

          {/* Mode toggle for member */}
          {tab === 'member' && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem' }}>
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                  fontWeight: 700, fontSize: '0.9rem', padding: '4px 0',
                  color: mode === m ? '#C8102E' : 'var(--gray-400)',
                  borderBottom: mode === m ? '2px solid #C8102E' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
              ))}
            </div>
          )}

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {/* Demo credentials */}
          <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#1E40AF' }}>
            <strong>Demo:</strong> {tab === 'admin' ? 'admin@fycjakma.com / FYC@Admin2057!' : 'member@fyc.com / fyc2057'}
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'member' && mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+977 XXXXXXXXXX" />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter password" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Please wait...' : tab === 'admin' ? '🔐 Login as Admin' : mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--gray-400)' }}>
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
