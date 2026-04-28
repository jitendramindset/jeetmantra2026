const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'jeetmantra.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function seedDatabase() {
    try {
        console.log('Creating tables...');
        
        // Users table
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'partner', 'superadmin', 'admin', 'institute', 'branch', 'school')),
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                language_pref TEXT DEFAULT 'en',
                theme_pref TEXT DEFAULT 'light',
                accent_color TEXT DEFAULT 'saffron',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Courses table
        db.exec(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Lessons table
        db.exec(`
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                content TEXT,
                scheduled_date DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Enrollments table
        db.exec(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                enrolled_date DATE DEFAULT CURRENT_DATE,
                UNIQUE(student_id, course_id)
            );
        `);
        
        // Attendance table
        db.exec(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                status TEXT CHECK (status IN ('present', 'absent')),
                UNIQUE(teacher_id, student_id, lesson_id, date)
            );
        `);
        
        // Earnings table
        db.exec(`
            CREATE TABLE IF NOT EXISTS earnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                description TEXT
            );
        `);
        
        // Services table
        db.exec(`
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2)
            );
        `);
        
        // Bookings table
        db.exec(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                customer_name TEXT NOT NULL,
                service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled'))
            );
        `);
        
        console.log('Creating indexes...');
        
        db.exec(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
            CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
            CREATE INDEX IF NOT EXISTS idx_attendance_teacher ON attendance(teacher_id);
            CREATE INDEX IF NOT EXISTS idx_earnings_teacher ON earnings(teacher_id);
            CREATE INDEX IF NOT EXISTS idx_services_partner ON services(partner_id);
            CREATE INDEX IF NOT EXISTS idx_bookings_partner ON bookings(partner_id);
        `);
        
        // Clear existing data
        db.exec(`
            DELETE FROM bookings;
            DELETE FROM services;
            DELETE FROM earnings;
            DELETE FROM attendance;
            DELETE FROM enrollments;
            DELETE FROM lessons;
            DELETE FROM courses;
            DELETE FROM users;
        `);
        
        console.log('Inserting default users...');
        
        const insertUser = db.prepare(`
            INSERT INTO users (role, name, email, language_pref, theme_pref, accent_color)
            VALUES (?, ?, ?, 'en', 'light', 'saffron')
        `);
        
        const users = [
            ['superadmin', 'Super Admin', 'superadmin@jeetmantra.com'],
            ['admin', 'Admin User', 'admin@jeetmantra.com'],
            ['teacher', 'Raj Kumar', 'raj.teacher@jeetmantra.com'],
            ['teacher', 'Priya Singh', 'priya.teacher@jeetmantra.com'],
            ['student', 'Arjun Patel', 'arjun.student@jeetmantra.com'],
            ['student', 'Neha Sharma', 'neha.student@jeetmantra.com'],
            ['student', 'Rohan Gupta', 'rohan.student@jeetmantra.com'],
            ['partner', 'Merchant Solutions', 'partner@jeetmantra.com'],
            ['institute', 'Delhi Institute', 'institute@jeetmantra.com'],
            ['branch', 'Delhi Branch', 'branch@jeetmantra.com'],
            ['school', 'Delhi Public School', 'school@jeetmantra.com']
        ];
        
        const userIds = {};
        let userId = 1;
        for (const [role, name, email] of users) {
            insertUser.run(role, name, email);
            userIds[email] = userId++;
        }
        
        console.log('Inserting sample courses...');
        
        const teachers = db.prepare('SELECT id FROM users WHERE role = \'teacher\' ORDER BY id').all();
        const insertCourse = db.prepare(`
            INSERT INTO courses (title, description, teacher_id)
            VALUES (?, ?, ?)
        `);
        
        const courseIds = [];
        const courses = [
            ['Mathematics Fundamentals', 'Learn basic math concepts', teachers[0].id],
            ['Advanced Physics', 'Explore modern physics concepts', teachers[1].id],
            ['English Language', 'Improve communication skills', teachers[0].id],
            ['Science for Beginners', 'Introduction to science', teachers[1].id],
            ['Computer Programming', 'Learn coding basics', teachers[0].id]
        ];
        
        courses.forEach(course => {
            insertCourse.run(...course);
            courseIds.push(db.prepare('SELECT last_insert_rowid() as id').get().id);
        });
        
        console.log('Inserting lessons...');
        
        const insertLesson = db.prepare(`
            INSERT INTO lessons (course_id, title, content, scheduled_date)
            VALUES (?, ?, ?, ?)
        `);
        
        const today = new Date().toISOString().split('T')[0];
        const lessonIds = [];
        const lessons = [
            [courseIds[0], 'Numbers and Operations', 'Understanding numbers, addition, subtraction', today],
            [courseIds[0], 'Fractions and Decimals', 'Learn about fractions and decimal numbers', addDays(today, 1)],
            [courseIds[1], 'Quantum Mechanics', 'Introduction to quantum theory', addDays(today, 2)],
            [courseIds[1], 'Relativity', 'Einstein\'s theory of relativity', addDays(today, 3)],
            [courseIds[2], 'Grammar Basics', 'Parts of speech and sentence structure', addDays(today, 1)],
            [courseIds[3], 'Biology Basics', 'Cells and organisms', addDays(today, 2)],
            [courseIds[4], 'Variables and Functions', 'Programming fundamentals', addDays(today, 3)]
        ];
        
        lessons.forEach(lesson => {
            insertLesson.run(...lesson);
            lessonIds.push(db.prepare('SELECT last_insert_rowid() as id').get().id);
        });
        
        console.log('Inserting enrollments...');
        
        const students = db.prepare('SELECT id FROM users WHERE role = \'student\' ORDER BY id').all();
        const insertEnrollment = db.prepare(`
            INSERT INTO enrollments (student_id, course_id, enrolled_date)
            VALUES (?, ?, ?)
        `);
        
        const enrollments = [
            [students[0].id, courseIds[0], today],
            [students[1].id, courseIds[0], today],
            [students[2].id, courseIds[1], today],
            [students[0].id, courseIds[2], today],
            [students[1].id, courseIds[2], today],
            [students[2].id, courseIds[4], addDays(today, 1)]
        ];
        
        enrollments.forEach(enrollment => {
            insertEnrollment.run(...enrollment);
        });
        
        console.log('Inserting attendance records...');
        
        const insertAttendance = db.prepare(`
            INSERT INTO attendance (teacher_id, student_id, lesson_id, date, status)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        insertAttendance.run(teachers[0].id, students[0].id, lessonIds[0], today, 'present');
        insertAttendance.run(teachers[0].id, students[1].id, lessonIds[0], today, 'present');
        insertAttendance.run(teachers[1].id, students[2].id, lessonIds[1], today, 'absent');
        insertAttendance.run(teachers[0].id, students[0].id, lessonIds[2], addDays(today, -1), 'present');
        insertAttendance.run(teachers[1].id, students[2].id, lessonIds[3], addDays(today, -1), 'present');
        
        console.log('Inserting earnings...');
        
        const insertEarning = db.prepare(`
            INSERT INTO earnings (teacher_id, amount, date, description)
            VALUES (?, ?, ?, ?)
        `);
        
        insertEarning.run(teachers[0].id, 5000, today, 'Monthly salary');
        insertEarning.run(teachers[1].id, 4500, today, 'Monthly salary');
        insertEarning.run(teachers[0].id, 2000, addDays(today, -1), 'Bonus');
        insertEarning.run(teachers[1].id, 1500, addDays(today, -2), 'Bonus');
        
        console.log('Inserting services...');
        
        const partner = db.prepare('SELECT id FROM users WHERE role = \'partner\'').get();
        const insertService = db.prepare(`
            INSERT INTO services (partner_id, name, description, price)
            VALUES (?, ?, ?, ?)
        `);
        
        const serviceIds = [];
        const services = [
            [partner.id, 'Web Development', 'Custom website development services', 50000],
            [partner.id, 'Mobile App Development', 'iOS and Android app development', 75000],
            [partner.id, 'Digital Marketing', 'Social media and SEO marketing', 25000],
            [partner.id, 'Cloud Consulting', 'AWS and cloud infrastructure setup', 40000]
        ];
        
        services.forEach(service => {
            insertService.run(...service);
            serviceIds.push(db.prepare('SELECT last_insert_rowid() as id').get().id);
        });
        
        console.log('Inserting bookings...');
        
        const insertBooking = db.prepare(`
            INSERT INTO bookings (partner_id, customer_name, service_id, date, status)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        insertBooking.run(partner.id, 'Acme Corp', serviceIds[0], addDays(today, 5), 'booked');
        insertBooking.run(partner.id, 'Tech Startup', serviceIds[1], addDays(today, 3), 'booked');
        insertBooking.run(partner.id, 'Enterprise Inc', serviceIds[0], addDays(today, -1), 'completed');
        insertBooking.run(partner.id, 'Small Business', serviceIds[2], addDays(today, -5), 'completed');
        
        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Default Login Credentials:');
        console.log('=====================================');
        console.log('SuperAdmin:  superadmin@jeetmantra.com');
        console.log('Admin:       admin@jeetmantra.com');
        console.log('Teacher:     raj.teacher@jeetmantra.com');
        console.log('Teacher:     priya.teacher@jeetmantra.com');
        console.log('Student:     arjun.student@jeetmantra.com');
        console.log('Student:     neha.student@jeetmantra.com');
        console.log('Student:     rohan.student@jeetmantra.com');
        console.log('Partner:     partner@jeetmantra.com');
        console.log('Institute:   institute@jeetmantra.com');
        console.log('Branch:      branch@jeetmantra.com');
        console.log('School:      school@jeetmantra.com');
        console.log('=====================================\n');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        db.close();
    }
}

function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

seedDatabase();
