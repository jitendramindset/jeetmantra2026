function BranchDashboard({ user, data }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="page-title">Branch Dashboard</h2>
        <p className="section-text">Manage your branch's daily operations.</p>

        <div className="grid grid-3">
          <div className="card">
            <h3>Branch Overview</h3>
            <p>Your branch's current status.</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="card">
            <h3>Today's Schedule</h3>
            <p>View and manage today's classes.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Schedule</button>
          </div>

          <div className="card">
            <h3>Student Management</h3>
            <p>Manage enrolled students.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Students</button>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Attendance Tracking</h3>
            <p>Monitor daily attendance.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Track Attendance</button>
          </div>

          <div className="card">
            <h3>Class Management</h3>
            <p>Assign teachers to classes.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Classes</button>
          </div>

          <div className="card">
            <h3>Branch Reports</h3>
            <p>Generate branch-specific reports.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Reports</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchDashboard;