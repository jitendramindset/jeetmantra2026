function SuperAdminDashboard({ user, data }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="page-title">Super Admin Dashboard</h2>
        <p className="section-text">Full platform control and oversight.</p>

        <div className="grid grid-3">
          <div className="card">
            <h3>System Overview</h3>
            {data && data.length > 0 ? (
              <div>
                <p><strong>Total Users:</strong> {data[0].total_users || 0}</p>
                <p><strong>Students:</strong> {data[0].students || 0}</p>
                <p><strong>Teachers:</strong> {data[0].teachers || 0}</p>
                <p><strong>Partners:</strong> {data[0].partners || 0}</p>
                <p><strong>Courses:</strong> {data[0].total_courses || 0}</p>
                <p><strong>Bookings:</strong> {data[0].total_bookings || 0}</p>
              </div>
            ) : (
              <p>Loading system stats...</p>
            )}
          </div>

          <div className="card">
            <h3>Institute Management</h3>
            <p>Manage institutes and their branches.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Institutes</button>
          </div>

          <div className="card">
            <h3>Global Settings</h3>
            <p>System-wide configuration.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>System Settings</button>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Admin Management</h3>
            <p>Assign and manage admin roles.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Admins</button>
          </div>

          <div className="card">
            <h3>Financial Reports</h3>
            <p>Platform revenue and financials.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Financial Reports</button>
          </div>

          <div className="card">
            <h3>System Health</h3>
            <p>Monitor system performance.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>System Health</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuperAdminDashboard;