import { useEffect, useState } from 'react';
import { fetchCourses } from '../lib/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Courses Marketplace</h1>
        <p className="section-text">Browse classrooms, skills, and coaching programs for academics, AI, and sports.</p>

        {loading && <p>Loading courses...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="grid grid-3">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Teacher:</strong> {course.teacher_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Courses;
