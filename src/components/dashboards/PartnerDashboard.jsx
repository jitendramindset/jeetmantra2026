import { useState } from 'react';

function PartnerDashboard({ user, data }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const services = data || [];
  const bookings = [
    { student: 'Rahul Kumar', service: 'Python Basics', time: 'Today • 9:00 AM', status: 'confirmed' },
    { student: 'Priya Singh', service: 'AI Workshop', time: 'Today • 11:00 AM', status: 'confirmed' },
    { student: 'Sneha Gupta', service: 'Web Dev Intro', time: 'Today • 2:00 PM', status: 'pending' },
    { student: 'Rohan Jha', service: 'Python Basics', time: 'Today • 4:00 PM', status: 'confirmed' }
  ];

  const renderOverview = () => (
    <>
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Bookings Today</h3>
          <p className="metric">4</p>
          <p>Pending this week</p>
        </div>
        <div className="card">
          <h3>Active Students</h3>
          <p className="metric">182</p>
          <p>This month</p>
        </div>
        <div className="card">
          <h3>Monthly Revenue</h3>
          <p className="metric">₹36,400</p>
          <p>April 2025</p>
        </div>
        <div className="card">
          <h3>Avg. Rating</h3>
          <p className="metric">4.8★</p>
          <p>Based on reviews</p>
        </div>
      </div>

      <div className="card">
        <h3>Today's Bookings</h3>
        <div className="data-list">
          {bookings.map((booking, index) => (
            <div key={index} className="list-item">
              <div>
                <strong>{booking.student}</strong>
                <p>{booking.service}</p>
              </div>
              <div>
                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                <p>{booking.time}</p>
              </div>
              <button className="btn-primary">Mark Attendance</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderBookings = () => (
    <div className="card">
      <h3>All Bookings</h3>
      <table className="data-table">
        <thead>
          <tr><th>Student</th><th>Service</th><th>Date & Time</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.student}</td>
              <td>{booking.service}</td>
              <td>{booking.time}</td>
              <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
              <td><button className="btn-primary">Attend</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderServices = () => (
    <div className="grid grid-3" style={{ gap: '1.5rem' }}>
      {services.length > 0 ? services.map((service, index) => (
        <div key={index} className="card">
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p><strong>Price:</strong> ₹{service.price}</p>
          <p><strong>Bookings:</strong> {service.total_bookings || 0}</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary">Edit</button>
            <button className="btn-secondary">Pause</button>
          </div>
        </div>
      )) : (
        <div className="card"><p>No services listed yet.</p></div>
      )}
    </div>
  );

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="page-title">Welcome, {user.name.split(' ')[0]}</h2>
            <p className="section-text">Manage your partner listings, bookings, and revenue from a single dashboard.</p>
          </div>
          <button className="btn-primary">Switch Role</button>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {['Overview', 'Bookings', 'My Services'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Bookings' && renderBookings()}
        {activeTab === 'My Services' && renderServices()}
      </div>
    </section>
  );
}

export default PartnerDashboard;
