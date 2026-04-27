function SchoolDashboard({ user, data }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="page-title">School Dashboard</h2>
        <p className="section-text">Manage school-level student groups and activities.</p>

        <div className="grid grid-3">
          <div className="card">
            <h3>School Overview</h3>
            <p>Your school's current status.</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="card">
            <h3>Student Groups</h3>
            <p>Manage student groups and batches.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Groups</button>
          </div>

          <div className="card">
            <h3>Activity Coordination</h3>
            <p>Coordinate with activity partners.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Activities</button>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Enrollment Management</h3>
            <p>Handle student enrollments.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Enrollments</button>
          </div>

          <div className="card">
            <h3>Performance Tracking</h3>
            <p>Monitor student performance.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Performance</button>
          </div>

          <div className="card">
            <h3>School Reports</h3>
            <p>Generate school-level reports.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Generate Reports</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SchoolDashboard;