import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    //setMobileOpen(false);
    //setUserMenuOpen(false);
  };

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(form.email, form.password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false); // ← always resets, no matter what happens
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gray-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--navbar-h) + 2rem) 1rem 2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            margin: '0 auto 1rem', overflow: 'hidden',
            border: '3px solid #C8102E', background: 'white',
          }}>
            <img
              src="/logo.png"
              alt="FYC"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
              onError={e => {
                e.target.parentElement.style.background = '#C8102E';
                e.target.parentElement.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-weight:800;font-size:1rem;">FYC</span>';
              }}
            />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)' }}>Fulbari Yuba Club</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>Jakma — F.Y.C Admin Portal</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gray-900)', margin: 0 }}>🔐 Admin Login</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.83rem', marginTop: '4px' }}>Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B',
              padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem',
              fontWeight: 600, marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: '2.8rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : '🔐 Login as Admin'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--gray-400)' }}>
            <NavLink to="/" onClick={handleNavClick} style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to website</NavLink>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
