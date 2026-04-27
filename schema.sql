-- JeetMantra Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'partner', 'superadmin', 'admin', 'institute', 'branch', 'school')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    language_pref VARCHAR(10) DEFAULT 'en',
    theme_pref VARCHAR(10) DEFAULT 'light',
    accent_color VARCHAR(20) DEFAULT 'saffron'
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    scheduled_date DATE
);

-- Enrollments table (for students)
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, course_id)
);

-- Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(10) CHECK (status IN ('present', 'absent')),
    UNIQUE(teacher_id, student_id, lesson_id, date)
);

-- Earnings table
CREATE TABLE earnings (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT
);

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2)
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled'))
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_attendance_teacher ON attendance(teacher_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_earnings_teacher ON earnings(teacher_id);
CREATE INDEX idx_services_partner ON services(partner_id);
CREATE INDEX idx_bookings_partner ON bookings(partner_id);