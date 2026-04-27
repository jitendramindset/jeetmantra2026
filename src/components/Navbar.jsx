import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 0' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0f172a' }}>
          JeetMantra
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/courses">Courses</Link>
          <Link to="/earn">Earn</Link>
          <Link to="/partner">Partner</Link>
          <Link to="/become-teacher">Teacher</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <span style={{ color: '#0f172a' }}>{user.name}</span>
              <button className="btn-primary" style={{ padding: '0.75rem 1rem' }} onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
