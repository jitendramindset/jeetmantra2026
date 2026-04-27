import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ user, onLogout, children }) {
  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <main>{children}</main>
      <footer className="section" style={{ background: '#0f172a', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>JeetMantra</strong>
            <p style={{ marginTop: '0.5rem', color: '#d1d5db' }}>Modern Gurukul for students, teachers, and partners.</p>
          </div>
          <div style={{ color: '#d1d5db' }}>
            <p>Contact: +91 98765 43210</p>
            <p>Galaxia Mall, Ranchi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
