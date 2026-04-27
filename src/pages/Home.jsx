import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="section" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <h1 className="page-title">Seekho. Bano. Jeeto.</h1>
            <p className="section-text">
              JeetMantra is a modern Gurukul for students, teachers, and partners. Learn academics, skills, AI, sports, and earn while you grow.
            </p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </div>
          <div className="grid grid-3" style={{ alignItems: 'stretch' }}>
            <div className="card">
              <h3>Learn</h3>
              <p>Academic coaching for Class 7–12, JEE, NEET, CA.</p>
            </div>
            <div className="card">
              <h3>Earn</h3>
              <p>Referral, task, and content rewards for students.</p>
            </div>
            <div className="card">
              <h3>Partner</h3>
              <p>Partner onboarding for schools, coaches, and activity centers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="page-title">Programs</h2>
          <p className="section-text">Choose from academic coaching, skills training, AI programs, and sports experiences.</p>
          <div className="grid grid-3">
            <div className="card">
              <h3>Academics</h3>
              <p>Structured learning for school and competitive exams.</p>
            </div>
            <div className="card">
              <h3>AI & Skills</h3>
              <p>Build future-ready skills with AI, coding, and communication.</p>
            </div>
            <div className="card">
              <h3>Sports</h3>
              <p>Sports programs that boost discipline and energy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <h2 className="page-title">Earn While Learn</h2>
          <p className="section-text">Students can earn rewards and wallet credit through referrals, tasks, and active participation.</p>
          <Link to="/earn" className="btn-primary">Start Earning</Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
