import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const testCredentials = [
    { role: 'Super Admin', email: 'superadmin@jeetmantra.com' },
    { role: 'Admin', email: 'admin@jeetmantra.com' },
    { role: 'Teacher', email: 'raj.teacher@jeetmantra.com' },
    { role: 'Student', email: 'arjun.student@jeetmantra.com' },
    { role: 'Partner', email: 'partner@jeetmantra.com' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call webhook endpoint
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auth.login',
          identity: 'login-page',
          data: { email },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('session', JSON.stringify(result.data.session));
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (testEmail) => {
    setEmail(testEmail);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>JeetMantra Login</h1>
        <p className="subtitle">Enter your email to login</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="test-credentials">
          <h3>Test Accounts</h3>
          <p className="text-small">Quick login (click to fill)</p>
          {testCredentials.map((cred) => (
            <button
              key={cred.email}
              onClick={() => quickLogin(cred.email)}
              className="btn-secondary"
              type="button"
            >
              {cred.role}: {cred.email}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-box {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
        }
        .login-box h1 {
          margin: 0 0 10px;
          color: #333;
        }
        .subtitle {
          color: #666;
          margin-bottom: 20px;
        }
        .input-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          box-sizing: border-box;
        }
        .btn-primary {
          width: 100%;
          padding: 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .btn-primary:hover:not(:disabled) {
          background: #5568d3;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-message {
          color: #d32f2f;
          margin-bottom: 15px;
          font-size: 14px;
        }
        .test-credentials {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .test-credentials h3 {
          margin: 0 0 5px;
          font-size: 16px;
        }
        .text-small {
          margin: 0 0 10px;
          font-size: 12px;
          color: #999;
        }
        .btn-secondary {
          width: 100%;
          padding: 10px;
          margin-bottom: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          text-align: left;
        }
        .btn-secondary:hover {
          background: #e8e8e8;
        }
      `}</style>
    </div>
  );
}

export default Login;
