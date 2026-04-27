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
        <div className="card">
          <h3>Attendance</h3>
          <p className="metric">{Math.round((completedClasses / totalClasses) * 100) || 87}%</p>
          <p>Attendance this month</p>
        </div>
        <div className="card">
          <h3>Classes Done</h3>
          <p className="metric">{completedClasses}/{totalClasses}</p>
          <p>Completed classes</p>
        </div>
        <div className="card">
          <h3>Wallet Balance</h3>
          <p className="metric">₹{walletBalance.toLocaleString()}</p>
          <p>Ready to withdraw</p>
        </div>
        <div className="card">
          <h3>Skills Learned</h3>
          <p className="metric">{skillsLearned}</p>
          <p>New skills this week</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Quick Actions</h3>
        <div className="grid grid-actions">
          {['Live Lecture', 'Recorded', 'Take Test', 'Do Quiz', 'See Books', 'Homework', 'Book Class'].map((action) => (
            <button key={action} className="action-pill">{action}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <h3>Upcoming Classes</h3>
          {courses.length > 0 ? (
            <ul>
              {courses.slice(0, 3).map((item, index) => (
                <li key={index} style={{ marginBottom: '0.75rem' }}>
                  <strong>{item.title}</strong><br />
                  {item.lesson_title || 'Next lesson coming soon'}<br />
                  <span className="text-muted">{item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : 'Date TBD'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming classes scheduled.</p>
          )}
        </div>

        <div className="card">
          <h3>Homework & Notes</h3>
          <ul>
            <li>Complete exercise set 1 for Algebra.</li>
            <li>Review science experiment notes.</li>
            <li>Submit essay on English literature.</li>
          </ul>
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
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="page-title">Good morning, {user.name.split(' ')[0]} 👋</h2>
            <p className="section-text">Track your learning progress, attendance, wallet, and profile updates.</p>
          </div>
          <button className="btn-primary">Switch Role</button>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem' }}>
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
