import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchDashboard(userData);
  }, []);

  const fetchDashboard = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dashboard.fetch',
          identity: 'dashboard-page',
          userId: userData.id,
          role: userData.role,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setDashboard(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}</h1>
        <p className="role-badge">{user?.role?.toUpperCase()}</p>
      </header>

      <div className="dashboard-grid">
        {Array.isArray(dashboard) ? (
          dashboard.map((item, idx) => (
            <div key={idx} className="dashboard-card">
              <h3>{item.title || item.name}</h3>
              <p>{item.description}</p>
              <div className="card-stats">
                {item.enrolled_students && <span>Students: {item.enrolled_students}</span>}
                {item.total_bookings && <span>Bookings: {item.total_bookings}</span>}
                {item.total_earnings && <span>Earnings: ₹{item.total_earnings}</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Users</h4>
              <p className="stat-value">{dashboard.total_users || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Students</h4>
              <p className="stat-value">{dashboard.students || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Teachers</h4>
              <p className="stat-value">{dashboard.teachers || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Courses</h4>
              <p className="stat-value">{dashboard.courses || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Bookings</h4>
              <p className="stat-value">{dashboard.bookings || 0}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .dashboard-header {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .dashboard-header h1 {
          margin: 0;
          color: #333;
        }
        .role-badge {
          margin: 5px 0 0;
          color: #667eea;
          font-weight: bold;
          font-size: 14px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .dashboard-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .dashboard-card h3 {
          margin: 0 0 10px;
          color: #333;
        }
        .dashboard-card p {
          color: #666;
          margin: 0 0 15px;
          font-size: 14px;
        }
        .card-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          color: #999;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-card h4 {
          margin: 0 0 10px;
          color: #666;
          font-size: 14px;
        }
        .stat-value {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
        }
        .loading, .error {
          padding: 20px;
          text-align: center;
          background: white;
          border-radius: 8px;
          margin: 20px;
        }
        .error {
          color: #d32f2f;
          border-left: 4px solid #d32f2f;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
