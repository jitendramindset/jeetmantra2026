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
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Total Students</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>{totalStudents || 340}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Active enrolments</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Avg Attendance</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>86%</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>This month</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Earnings</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>₹{totalEarnings.toLocaleString() || '28,400'}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Payout due</p>
        </div>
        <div className="card" style={{ textAlign: 'center', paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>Active Courses</p>
          <p className="metric" style={{ margin: '0.75rem 0' }}>{classes.length || 4}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#999' }}>Running now</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Today's Schedule</h3>
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
            <div key={index} className="card" style={{ backgroundColor: '#f9f9f9', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.title}</p>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>📍 Batch A • 7:00 AM</p>
              <p style={{ margin: '0.5rem 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>{item.enrolled_students || 42} students registered</p>
              <div style={{ display: 'flex', gap: '0.5rem', gap: '0.75rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '0.65rem 0.75rem', fontSize: '0.9rem' }}>Mark Attendance</button>
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
    <section className="section" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#1a1a1a' }}>Good morning, Mr. {user.name.split(' ')[1] || user.name.split(' ')[0]}</h2>
          <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>Monday, April 28, 2025</p>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
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
