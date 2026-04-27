import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="page-title">Login</h1>
        <p className="section-text">Use your registered email to access your JeetMantra dashboard.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.5rem' }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{ padding: '0.85rem', borderRadius: '12px', border: '1px solid #d1d5db' }}
            />
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
