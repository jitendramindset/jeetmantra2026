import React, { useState, useEffect } from 'react';

function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData.role === 'partner') {
      fetchServices(userData.id);
      fetchBookings(userData.id);
    }
  }, []);

  const fetchServices = async (userId) => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'service.list',
          identity: 'services-page',
          userId: userId,
          data: { partner_id: userId },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'booking.list',
          identity: 'services-page',
          userId: userId,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'service.create',
          identity: 'services-page',
          userId: user.id,
          data: {
            ...formData,
            price: parseFloat(formData.price)
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setFormData({ name: '', description: '', price: '' });
        fetchServices(user.id);
      }
    } catch (err) {
      console.error('Error creating service:', err);
    }
  };

  if (user?.role !== 'partner') {
    return <div className="error">Only partners can access this section</div>;
  }

  return (
    <div className="services-container">
      <div className="header">
        <h1>My Services</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="services-grid">
            {services.length === 0 ? (
              <p className="empty-state">No services yet. Create your first service!</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="service-card">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-footer">
                    <span className="price">₹{service.price?.toLocaleString() || '0'}</span>
                    <button className="btn-small">Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bookings-section">
            <h2>Recent Bookings</h2>
            {bookings.length === 0 ? (
              <p className="empty-state">No bookings yet</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.customer_name}</td>
                      <td>{booking.service_name}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Service</h2>
            <form onSubmit={handleCreateService}>
              <input
                type="text"
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea-field"
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                step="0.01"
                className="input-field"
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .services-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .service-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .service-card h3 {
          margin: 0 0 10px;
        }
        .service-card p {
          color: #666;
          margin: 0 0 15px;
          min-height: 40px;
        }
        .service-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price {
          font-size: 20px;
          font-weight: bold;
          color: #667eea;
        }
        .btn-small {
          padding: 6px 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-small:hover {
          background: #e0e0e0;
        }
        .bookings-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .bookings-section h2 {
          margin: 0 0 20px;
        }
        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }
        .bookings-table th,
        .bookings-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .bookings-table th {
          background: #f9f9f9;
          font-weight: bold;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-badge.booked {
          background: #fff3cd;
          color: #856404;
        }
        .status-badge.completed {
          background: #d4edda;
          color: #155724;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
        }
        .modal-content h2 {
          margin: 0 0 20px;
        }
        .input-field, .textarea-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .textarea-field {
          resize: vertical;
          min-height: 80px;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
        }
        .btn-primary {
          flex: 1;
          padding: 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-secondary {
          flex: 1;
          padding: 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .error {
          padding: 20px;
          background: #ffebee;
          color: #c62828;
          margin: 20px;
        }
        .loading, .empty-state {
          text-align: center;
          padding: 40px;
          color: #999;
        }
      `}</style>
    </div>
  );
}

export default ServicesScreen;
