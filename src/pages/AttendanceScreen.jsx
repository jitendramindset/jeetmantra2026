import React, { useState, useEffect } from 'react';

function AttendanceScreen() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData.role === 'teacher') {
      fetchLessons();
    }
  }, []);

  const fetchLessons = async () => {
    try {
      // In a real app, fetch lessons for this teacher
      setLessons([
        { id: 1, title: 'Lesson 1 - Basics', course_id: 1 },
        { id: 2, title: 'Lesson 2 - Advanced', course_id: 1 }
      ]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setLoading(false);
    }
  };

  const selectLesson = async (lessonId) => {
    setSelectedLesson(lessonId);
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'attendance.list',
          identity: 'attendance-page',
          userId: user.id,
          data: { lesson_id: lessonId },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setAttendance(result.data);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const recordAttendance = async (studentId, status) => {
    try {
      await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'attendance.record',
          identity: 'attendance-page',
          userId: user.id,
          data: {
            student_id: studentId,
            lesson_id: selectedLesson,
            status: status,
            date: new Date().toISOString().split('T')[0]
          },
          timestamp: new Date().toISOString()
        })
      });

      selectLesson(selectedLesson);
    } catch (err) {
      console.error('Error recording attendance:', err);
    }
  };

  if (user?.role !== 'teacher') {
    return <div className="error">Only teachers can access attendance</div>;
  }

  return (
    <div className="attendance-container">
      <h1>Attendance Management</h1>

      <div className="attendance-layout">
        <div className="lessons-sidebar">
          <h2>Lessons</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="lessons-list">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => selectLesson(lesson.id)}
                  className={`lesson-item ${selectedLesson === lesson.id ? 'active' : ''}`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="attendance-main">
          {selectedLesson ? (
            <div className="attendance-list">
              <h2>Record Attendance</h2>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.student_name || 'Student ' + record.student_id}</td>
                      <td>
                        <span className={`status-badge ${record.status}`}>
                          {record.status || 'Not marked'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => recordAttendance(record.student_id, 'present')}
                          className="btn-small present"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => recordAttendance(record.student_id, 'absent')}
                          className="btn-small absent"
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>Select a lesson to view and mark attendance</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .attendance-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .attendance-layout {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        .lessons-sidebar {
          width: 250px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          height: fit-content;
        }
        .lessons-sidebar h2 {
          margin: 0 0 15px;
          font-size: 16px;
        }
        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .lesson-item {
          padding: 12px;
          background: #f9f9f9;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .lesson-item:hover {
          border-color: #667eea;
        }
        .lesson-item.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        .attendance-main {
          flex: 1;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .attendance-table th,
        .attendance-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .attendance-table th {
          background: #f9f9f9;
          font-weight: bold;
          color: #333;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-badge.present {
          background: #4caf50;
          color: white;
        }
        .status-badge.absent {
          background: #f44336;
          color: white;
        }
        .btn-small {
          padding: 6px 12px;
          margin-right: 5px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          color: white;
        }
        .btn-small.present {
          background: #4caf50;
        }
        .btn-small.absent {
          background: #f44336;
        }
        .btn-small:hover {
          opacity: 0.8;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #999;
        }
        .error {
          padding: 20px;
          background: #ffebee;
          color: #c62828;
          border-left: 4px solid #c62828;
          margin: 20px;
        }
      `}</style>
    </div>
  );
}

export default AttendanceScreen;
