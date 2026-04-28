import React, { useState, useEffect } from 'react';

function CoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'course.list',
          identity: 'courses-page',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'course.create',
          identity: 'courses-page',
          userId: user.id,
          data: formData,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setFormData({ title: '', description: '' });
        fetchCourses();
      }
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Courses</h1>
        {user?.role === 'teacher' && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + New Course
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="courses-grid">
          {courses.length === 0 ? (
            <p className="empty-state">No courses yet</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="teacher-badge">{course.teacher_name}</span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-actions">
                  <button className="btn-secondary">View</button>
                  {user?.id === course.teacher_id && (
                    <button className="btn-secondary">Edit</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-field"
              />
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea-field"
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .courses-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .courses-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .courses-header h1 {
          margin: 0;
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .course-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }
        .course-header h3 {
          margin: 0;
          flex: 1;
        }
        .teacher-badge {
          background: #667eea;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
        .course-description {
          color: #666;
          margin: 10px 0 15px;
          line-height: 1.5;
        }
        .course-actions {
          display: flex;
          gap: 10px;
        }
        .btn-secondary {
          flex: 1;
          padding: 8px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .modal-content h2 {
          margin: 0 0 20px;
        }
        .input-field, .textarea-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          box-sizing: border-box;
        }
        .textarea-field {
          resize: vertical;
          min-height: 100px;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
        }
        .btn-primary {
          flex: 1;
          padding: 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .btn-primary:hover {
          background: #5568d3;
        }
        .loading, .empty-state {
          text-align: center;
          padding: 20px;
          color: #999;
        }
      `}</style>
    </div>
  );
}

export default CoursesScreen;
