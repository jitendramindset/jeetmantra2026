import { useState } from 'react';

function TeacherDashboard({ user, data }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const classes = data || [];
  const todaySchedule = classes.filter((item) => item.title).slice(0, 3);
  const totalStudents = todaySchedule.reduce((sum, item) => sum + Number(item.enrolled_students || 0), 0);
  const totalEarnings = classes.reduce((sum, item) => sum + Number(item.total_earnings || 0), 0);

  const attendanceStudents = [
    'Rahul Kumar', 'Priya Singh', 'Sneha Gupta', 'Rohan Jha', 'Amit Verma', 'Kavya Sharma'
  ];

  const renderOverview = () => (
    <>
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Total Students</h3>
          <p className="metric">{totalStudents || 340}</p>
          <p>Across active courses</p>
        </div>
        <div className="card">
          <h3>Avg Attendance</h3>
          <p className="metric">86%</p>
          <p>This month</p>
        </div>
        <div className="card">
          <h3>Monthly Earnings</h3>
          <p className="metric">₹{totalEarnings.toLocaleString() || '28,400'}</p>
          <p>Estimated payout</p>
        </div>
        <div className="card">
          <h3>Active Courses</h3>
          <p className="metric">{classes.length || 4}</p>
          <p>Live sessions this week</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Today's Schedule</h3>
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
            <div key={index} className="card card-small">
              <strong>{item.title}</strong>
              <p>{item.enrolled_students || 42} students</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button className="btn-primary">Take Attendance</button>
                <button className="btn-secondary">Go Live</button>
              </div>
            </div>
          )) : (
            <p>No classes scheduled for today.</p>
          )}
        </div>
      </div>
    </>
  );

  const renderMyClasses = () => (
    <div className="grid grid-3" style={{ gap: '1.5rem' }}>
      {classes.length > 0 ? classes.map((item, index) => (
        <div key={index} className="card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>Students:</strong> {item.enrolled_students || 35}</p>
          <p><strong>Progress:</strong> {Math.min(100, Math.round((item.present_today || 0) / 5 * 100))}%</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary">Attendance</button>
            <button className="btn-secondary">Live</button>
          </div>
        </div>
      )) : (
        <div className="card"><p>No courses available.</p></div>
      )}
    </div>
  );

  const renderTakeAttendance = () => (
    <div className="card">
      <h3>Take Attendance</h3>
      <p>Select your batch and mark student attendance.</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="card card-secondary">
          <strong>JEE Maths - Batch A</strong>
          <p>Today • 7:00 AM</p>
        </div>
        <div className="attendance-grid">
          {attendanceStudents.map((name) => (
            <div key={name} className="attendance-item">
              <span>{name}</span>
              <div>
                <button className="btn-tag">P</button>
                <button className="btn-tag btn-tag-secondary">A</button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary">Submit Attendance</button>
      </div>
    </div>
  );

  const renderLiveClass = () => (
    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
      <div className="card">
        <h3>Start Live Class</h3>
        <p>Instantly start a live video class for your students.</p>
        <button className="btn-primary">Go Live Now</button>
      </div>
      <div className="card">
        <h3>Schedule a Class</h3>
        <p>Plan your next batch and share the schedule.</p>
        <form>
          <label>Class / Batch</label>
          <input type="text" placeholder="JEE Maths - Batch A" />
          <label>Topic</label>
          <input type="text" placeholder="Integration" />
          <label>Date</label>
          <input type="date" />
          <label>Time</label>
          <input type="time" />
          <label>Duration (minutes)</label>
          <input type="number" placeholder="60" />
          <button className="btn-primary" style={{ marginTop: '1rem' }}>Schedule Class</button>
        </form>
      </div>
    </div>
  );

  const renderCreateCourse = () => (
    <div className="card">
      <h3>Create New Course</h3>
      <p>Use this form to launch a new teaching batch.</p>
      <div className="form-grid">
        <div>
          <label>Course Title</label>
          <input type="text" placeholder="JEE Mathematics - Advanced Batch" />
        </div>
        <div>
          <label>Subject</label>
          <input type="text" placeholder="Mathematics" />
        </div>
        <div>
          <label>Target Class</label>
          <input type="text" placeholder="JEE Mains" />
        </div>
        <div>
          <label>Description</label>
          <textarea placeholder="Describe what students will learn..." />
        </div>
        <button className="btn-primary" style={{ marginTop: '1rem' }}>Create Course</button>
      </div>
    </div>
  );

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="page-title">Good morning, Mr. {user.name.split(' ')[1] || user.name.split(' ')[0]}</h2>
            <p className="section-text">Manage your teacher dashboard, classes, attendance, and live sessions.</p>
          </div>
          <button className="btn-primary">Switch Role</button>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {['Overview', 'My Classes', 'Take Attendance', 'Live Class', 'Create Course'].map((tab) => (
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
        {activeTab === 'My Classes' && renderMyClasses()}
        {activeTab === 'Take Attendance' && renderTakeAttendance()}
        {activeTab === 'Live Class' && renderLiveClass()}
        {activeTab === 'Create Course' && renderCreateCourse()}
      </div>
    </section>
  );
}

export default TeacherDashboard;
