import { useState } from 'react';

function StudentDashboard({ user, data }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const courses = data || [];
  const attendanceRecords = courses.map((course) => ({
    course: course.title,
    status: course.attendance_status || 'present',
    date: course.scheduled_date ? new Date(course.scheduled_date).toLocaleDateString() : 'TBD'
  }));
  const completedClasses = attendanceRecords.filter((item) => item.status === 'present').length;
  const totalClasses = attendanceRecords.length || 4;
  const walletBalance = 1250;
  const skillsLearned = 3;

  const renderOverview = () => (
    <>
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attendance</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>{Math.round((completedClasses / totalClasses) * 100) || 87}%</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>This month</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classes</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>{completedClasses}/{totalClasses}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Done</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wallet</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>₹{walletBalance.toLocaleString()}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Ready</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>{skillsLearned}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Learned</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Quick Actions</h3>
        <div className="grid grid-actions">
          {['Live Lecture', 'Recorded', 'Take Test', 'Do Quiz', 'See Books', 'Homework', 'Book Class'].map((action) => (
            <button key={action} className="action-pill">{action}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Upcoming Classes</h3>
          {courses.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {courses.slice(0, 3).map((item, index) => (
                <div key={index} style={{ padding: '0.75rem', borderLeft: '3px solid #f97316', backgroundColor: '#fafafa' }}>
                  <p style={{ margin: '0', fontWeight: 600, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.title}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>{item.lesson_title || 'Next lesson'}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>{item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : 'Date TBD'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming classes scheduled.</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Homework</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <p style={{ margin: '0', color: '#1a1a1a', fontSize: '0.95rem' }}>• Complete exercise set 1 for Algebra</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <p style={{ margin: '0', color: '#1a1a1a', fontSize: '0.95rem' }}>• Review science experiment notes</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <p style={{ margin: '0', color: '#1a1a1a', fontSize: '0.95rem' }}>• Submit essay on English literature</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAttendance = () => (
    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
      <div className="card">
        <h3>Attendance Records</h3>
        {attendanceRecords.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>Course</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.course}</td>
                  <td>{record.date}</td>
                  <td><span className={`status-badge ${record.status}`}>{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance history available.</p>
        )}
      </div>

      <div className="card">
        <h3>Attendance Summary</h3>
        <p><strong>Present:</strong> {completedClasses}</p>
        <p><strong>Absent:</strong> {Math.max(0, totalClasses - completedClasses)}</p>
        <p><strong>Current Streak:</strong> {Math.max(0, completedClasses - 1)} days</p>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
      <div className="card">
        <h3>Wallet Overview</h3>
        <p><strong>Balance:</strong> ₹{walletBalance.toLocaleString()}</p>
        <p><strong>Pending:</strong> ₹450</p>
        <p><strong>Available:</strong> ₹{walletBalance.toLocaleString()}</p>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        <ul>
          <li>Referral reward ₹250</li>
          <li>Course completion bonus ₹200</li>
          <li>Attendance streak credit ₹100</li>
        </ul>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
      <div className="card">
        <h3>Student Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Language:</strong> English</p>
      </div>

      <div className="card">
        <h3>Preferences</h3>
        <p><strong>Theme:</strong> Light</p>
        <p><strong>Notifications:</strong> Enabled</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }}>Edit Profile</button>
      </div>
    </div>
  );

  return (
    <section className="section" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#1a1a1a' }}>Good morning, {user.name.split(' ')[0]} 👋</h2>
          <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>Monday, April 28, 2025</p>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
          {['Overview', 'Attendance', 'Wallet', 'Profile'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Attendance' && renderAttendance()}
        {activeTab === 'Wallet' && renderWallet()}
        {activeTab === 'Profile' && renderProfile()}
      </div>
    </section>
  );
}

export default StudentDashboard;
