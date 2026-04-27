function AdminDashboard({ user, data }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="section-text">Platform overview and management.</p>

        <div className="grid grid-3">
          <div className="card">
            <h3>Platform Stats</h3>
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
              <p>Loading stats...</p>
            )}
          </div>

          <div className="card">
            <h3>User Management</h3>
            <p>Manage users, roles, and permissions.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Users</button>
          </div>

          <div className="card">
            <h3>Course Management</h3>
            <p>Approve and manage courses.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Courses</button>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Partner Onboarding</h3>
            <p>Review and approve new partners.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Review Partners</button>
          </div>

          <div className="card">
            <h3>Reports</h3>
            <p>Generate platform reports.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Reports</button>
          </div>

          <div className="card">
            <h3>Settings</h3>
            <p>Platform configuration and settings.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Platform Settings</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;