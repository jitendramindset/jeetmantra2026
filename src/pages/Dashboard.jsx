import RoleDashboard from '../components/RoleDashboard';

function Dashboard({ user }) {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        <p className="section-text">
          Access your role-specific dashboard area for progress, bookings, and admin insights.
        </p>
        <RoleDashboard user={user} />
      </div>
    </main>
  );
}

export default Dashboard;
