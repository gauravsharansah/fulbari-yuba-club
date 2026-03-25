import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminLoginModal = () => {
  const { login, showAdminModal, setShowAdminModal } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAdminModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      setShowAdminModal(false);
      setForm({ email: '', password: '' });
      navigate('/admin');
    } catch {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setShowAdminModal(false);
    setError('');
    setShowPass(false);
    setForm({ email: '', password: '' });
  };

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        animation: 'modalIn 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#C8102E,#9B0B22)',
            margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem',
          }}>🔐</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--gray-900)', marginBottom: '0.3rem' }}>
            Admin Login
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            Restricted to authorized administrators only
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#991B1B', padding: '10px 14px', borderRadius: '8px',
            fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem',
          }}>✗ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@email.com"
              required
              autoFocus
            />
          </div>

          {/* Password with eye toggle */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter admin password"
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.1rem', color: 'var(--gray-400)', padding: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            onClick={close}
          >
            Cancel
          </button>
        </form>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginModal;
