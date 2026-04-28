import React, { useState, useEffect } from 'react';

function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchProfile(userData.id);
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'user.profile',
          identity: 'profile-page',
          userId: userId,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
        setFormData(result.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'user.update',
          identity: 'profile-page',
          userId: user.id,
          data: {
            name: formData.name,
            language_pref: formData.language_pref,
            theme_pref: formData.theme_pref,
            accent_color: formData.accent_color
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Profile updated successfully!');
        setEditing(false);
        fetchProfile(user.id);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error updating profile: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-card">
        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="input-field disabled"
              />
            </div>

            <div className="form-group">
              <label>Language Preference</label>
              <select
                value={formData.language_pref || 'en'}
                onChange={(e) => setFormData({ ...formData, language_pref: e.target.value })}
                className="input-field"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="form-group">
              <label>Theme</label>
              <select
                value={formData.theme_pref || 'light'}
                onChange={(e) => setFormData({ ...formData, theme_pref: e.target.value })}
                className="input-field"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="form-group">
              <label>Accent Color</label>
              <select
                value={formData.accent_color || 'saffron'}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="input-field"
              >
                <option value="saffron">Saffron</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Save</button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-field">
              <label>Name</label>
              <p>{profile?.name}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{profile?.email}</p>
            </div>
            <div className="profile-field">
              <label>Role</label>
              <p className="role-badge">{profile?.role?.toUpperCase()}</p>
            </div>
            <div className="profile-field">
              <label>Language</label>
              <p>{profile?.language_pref || 'en'}</p>
            </div>
            <div className="profile-field">
              <label>Theme</label>
              <p>{profile?.theme_pref || 'light'}</p>
            </div>
            <div className="profile-field">
              <label>Member Since</label>
              <p>{new Date(profile?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .profile-header h1 {
          margin: 0;
        }
        .message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .profile-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 600px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }
        .input-field {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          box-sizing: border-box;
        }
        .input-field.disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }
        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-primary {
          background: #667eea;
          color: white;
        }
        .btn-primary:hover {
          background: #5568d3;
        }
        .btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        .profile-display {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .profile-field {
          padding: 15px;
          background: #f9f9f9;
          border-radius: 4px;
        }
        .profile-field label {
          display: block;
          margin: 0 0 8px;
          font-weight: bold;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
        }
        .profile-field p {
          margin: 0;
          color: #333;
          font-size: 16px;
        }
        .role-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #999;
        }
      `}</style>
    </div>
  );
}

export default ProfileScreen;
