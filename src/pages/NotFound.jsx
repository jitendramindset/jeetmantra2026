import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Page Not Found</h1>
        <p className="section-text">The page you are looking for does not exist yet.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
