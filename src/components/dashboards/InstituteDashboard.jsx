function InstituteDashboard({ user, data }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="page-title">Institute Dashboard</h2>
        <p className="section-text">Manage your institute's programs and branches.</p>

        <div className="grid grid-3">
          <div className="card">
            <h3>Institute Overview</h3>
            <p>Your institute's current status.</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="card">
            <h3>Branch Management</h3>
            <p>Manage institute branches.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Branches</button>
          </div>

          <div className="card">
            <h3>Teacher Management</h3>
            <p>Assign teachers to branches.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Teachers</button>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>Course Programs</h3>
            <p>Design and manage course programs.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Manage Programs</button>
          </div>

          <div className="card">
            <h3>Student Enrollment</h3>
            <p>Track student enrollments across branches.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>View Enrollments</button>
          </div>

          <div className="card">
            <h3>Reports</h3>
            <p>Institute-level performance reports.</p>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Generate Reports</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstituteDashboard;