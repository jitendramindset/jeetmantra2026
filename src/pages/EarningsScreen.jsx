import React, { useState, useEffect } from 'react';

function EarningsScreen() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData.role === 'teacher') {
      fetchEarnings(userData.id);
    }
  }, []);

  const fetchEarnings = async (userId) => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'earnings.fetch',
          identity: 'earnings-page',
          userId: userId,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setEarnings(result.data);
      }
    } catch (err) {
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'teacher') {
    return <div className="error">Only teachers can view earnings</div>;
  }

  return (
    <div className="earnings-container">
      <h1>My Earnings</h1>

      {loading ? (
        <div className="loading">Loading earnings data...</div>
      ) : (
        <>
          <div className="earnings-summary">
            <div className="summary-card">
              <h2>Total Earnings</h2>
              <p className="big-amount">₹{earnings?.total?.toLocaleString() || '0'}</p>
            </div>
            <div className="summary-card">
              <h2>Recent Transactions</h2>
              <p className="info-text">{earnings?.monthly?.length || 0} in last 30 days</p>
            </div>
          </div>

          <div className="earnings-history">
            <h2>Earnings History</h2>
            {earnings?.monthly && earnings.monthly.length > 0 ? (
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.monthly.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.description}</td>
                      <td className="amount">+₹{entry.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No earnings yet</p>
            )}
          </div>
        </>
      )}

      <style>{`
        .earnings-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .earnings-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h2 {
          margin: 0 0 10px;
          font-size: 16px;
          color: #666;
        }
        .big-amount {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #4caf50;
        }
        .info-text {
          margin: 0;
          color: #999;
        }
        .earnings-history {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .earnings-history h2 {
          margin: 0 0 20px;
        }
        .earnings-table {
          width: 100%;
          border-collapse: collapse;
        }
        .earnings-table th,
        .earnings-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .earnings-table th {
          background: #f9f9f9;
          font-weight: bold;
          color: #333;
        }
        .earnings-table .amount {
          color: #4caf50;
          font-weight: bold;
        }
        .loading, .empty-state {
          text-align: center;
          padding: 40px;
          color: #999;
        }
        .error {
          padding: 20px;
          background: #ffebee;
          color: #c62828;
          border-left: 4px solid #c62828;
          margin: 20px;
        }
      `}</style>
    </div>
  );
}

export default EarningsScreen;
