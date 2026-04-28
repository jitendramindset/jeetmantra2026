const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function seedDatabase() {
    let client;
    try {
        client = await pool.connect();
        
        console.log('Creating tables...');
        
        // Drop existing tables if they exist
        await client.query(`
            DROP TABLE IF EXISTS bookings CASCADE;
            DROP TABLE IF EXISTS services CASCADE;
            DROP TABLE IF EXISTS earnings CASCADE;
            DROP TABLE IF EXISTS attendance CASCADE;
            DROP TABLE IF EXISTS enrollments CASCADE;
            DROP TABLE IF EXISTS lessons CASCADE;
            DROP TABLE IF EXISTS courses CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        `);
        
        // Create users table
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'partner', 'superadmin', 'admin', 'institute', 'branch', 'school')),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                language_pref VARCHAR(10) DEFAULT 'en',
                theme_pref VARCHAR(10) DEFAULT 'light',
                accent_color VARCHAR(20) DEFAULT 'saffron',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Create courses table
        await client.query(`
            CREATE TABLE courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Create lessons table
        await client.query(`
            CREATE TABLE lessons (
                id SERIAL PRIMARY KEY,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                content TEXT,
                scheduled_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Create enrollments table
        await client.query(`
            CREATE TABLE enrollments (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                enrolled_date DATE DEFAULT CURRENT_DATE,
                UNIQUE(student_id, course_id)
            );
        `);
        
        // Create attendance table
        await client.query(`
            CREATE TABLE attendance (
                id SERIAL PRIMARY KEY,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                status VARCHAR(10) CHECK (status IN ('present', 'absent')),
                UNIQUE(teacher_id, student_id, lesson_id, date)
            );
        `);
        
        // Create earnings table
        await client.query(`
            CREATE TABLE earnings (
                id SERIAL PRIMARY KEY,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                description TEXT
            );
        `);
        
        // Create services table
        await client.query(`
            CREATE TABLE services (
                id SERIAL PRIMARY KEY,
                partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10,2)
            );
        `);
        
        // Create bookings table
        await client.query(`
            CREATE TABLE bookings (
                id SERIAL PRIMARY KEY,
                partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                customer_name VARCHAR(100) NOT NULL,
                service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled'))
            );
        `);
        
        // Create indexes
        await client.query(`
            CREATE INDEX idx_users_email ON users(email);
            CREATE INDEX idx_users_role ON users(role);
            CREATE INDEX idx_courses_teacher ON courses(teacher_id);
            CREATE INDEX idx_enrollments_student ON enrollments(student_id);
            CREATE INDEX idx_attendance_teacher ON attendance(teacher_id);
        `);
        
        console.log('Inserting default users...');
        
        // Insert default users with all roles
        await client.query(`
            INSERT INTO users (role, name, email, language_pref, theme_pref, accent_color) VALUES
            ('superadmin', 'Super Admin', 'superadmin@jeetmantra.com', 'en', 'light', 'saffron'),
            ('admin', 'Admin User', 'admin@jeetmantra.com', 'en', 'light', 'saffron'),
            ('teacher', 'Raj Kumar', 'raj.teacher@jeetmantra.com', 'en', 'light', 'saffron'),
            ('teacher', 'Priya Singh', 'priya.teacher@jeetmantra.com', 'en', 'light', 'saffron'),
            ('student', 'Arjun Patel', 'arjun.student@jeetmantra.com', 'en', 'light', 'saffron'),
            ('student', 'Neha Sharma', 'neha.student@jeetmantra.com', 'en', 'light', 'saffron'),
            ('student', 'Rohan Gupta', 'rohan.student@jeetmantra.com', 'en', 'light', 'saffron'),
            ('partner', 'Merchant Solutions', 'partner@jeetmantra.com', 'en', 'light', 'saffron'),
            ('institute', 'Delhi Institute', 'institute@jeetmantra.com', 'en', 'light', 'saffron'),
            ('branch', 'Delhi Branch', 'branch@jeetmantra.com', 'en', 'light', 'saffron'),
            ('school', 'Delhi Public School', 'school@jeetmantra.com', 'en', 'light', 'saffron');
        `);
        
        console.log('Inserting sample courses...');
        
        // Get teacher IDs
        const teacherResult = await client.query(`
            SELECT id FROM users WHERE role = 'teacher' ORDER BY id
        `);
        const teachers = teacherResult.rows;
        
        // Insert courses
        await client.query(`
            INSERT INTO courses (title, description, teacher_id) VALUES
            ('Mathematics Fundamentals', 'Learn basic math concepts', $1),
            ('Advanced Physics', 'Explore modern physics concepts', $2),
            ('English Language', 'Improve communication skills', $1),
            ('Science for Beginners', 'Introduction to science', $2),
            ('Computer Programming', 'Learn coding basics', $1);
        `, [teachers[0].id, teachers[1].id]);
        
        console.log('Inserting lessons...');
        
        // Get course IDs
        const courseResult = await client.query(`
            SELECT id FROM courses ORDER BY id
        `);
        const courses = courseResult.rows;
        
        // Insert lessons
        await client.query(`
            INSERT INTO lessons (course_id, title, content, scheduled_date) VALUES
            ($1, 'Numbers and Operations', 'Understanding numbers, addition, subtraction', CURRENT_DATE),
            ($1, 'Fractions and Decimals', 'Learn about fractions and decimal numbers', CURRENT_DATE + INTERVAL '1 day'),
            ($2, 'Quantum Mechanics', 'Introduction to quantum theory', CURRENT_DATE + INTERVAL '2 days'),
            ($2, 'Relativity', 'Einstein''s theory of relativity', CURRENT_DATE + INTERVAL '3 days'),
            ($3, 'Grammar Basics', 'Parts of speech and sentence structure', CURRENT_DATE + INTERVAL '1 day'),
            ($4, 'Biology Basics', 'Cells and organisms', CURRENT_DATE + INTERVAL '2 days'),
            ($5, 'Variables and Functions', 'Programming fundamentals', CURRENT_DATE + INTERVAL '3 days');
        `, [courses[0].id, courses[0].id, courses[1].id, courses[1].id, courses[2].id, courses[3].id, courses[4].id]);
        
        console.log('Inserting enrollments...');
        
        // Get student IDs
        const studentResult = await client.query(`
            SELECT id FROM users WHERE role = 'student' ORDER BY id
        `);
        const students = studentResult.rows;
        
        // Insert enrollments
        if (students.length >= 3) {
            await client.query(`
                INSERT INTO enrollments (student_id, course_id, enrolled_date) VALUES
                ($1, $2, CURRENT_DATE),
                ($3, $2, CURRENT_DATE),
                ($4, $5, CURRENT_DATE),
                ($1, $6, CURRENT_DATE),
                ($3, $6, CURRENT_DATE),
                ($4, $7, CURRENT_DATE + INTERVAL '1 day');
            `, [students[0].id, courses[0].id, students[1].id, students[2].id, courses[1].id, courses[2].id, courses[4].id]);
        }
        
        console.log('Inserting attendance records...');
        
        // Insert attendance
        if (students.length >= 3 && teachers.length >= 2) {
            const lessonResult = await client.query(`
                SELECT id FROM lessons LIMIT 5
            `);
            const lessons = lessonResult.rows;
            
            if (lessons.length > 0) {
                await client.query(`
                    INSERT INTO attendance (teacher_id, student_id, lesson_id, date, status) VALUES
                    ($1, $2, $3, CURRENT_DATE, 'present'),
                    ($1, $4, $3, CURRENT_DATE, 'present'),
                    ($2, $5, $6, CURRENT_DATE, 'absent'),
                    ($1, $2, $7, CURRENT_DATE - INTERVAL '1 day', 'present'),
                    ($2, $4, $8, CURRENT_DATE - INTERVAL '1 day', 'present');
                `, [teachers[0].id, students[0].id, lessons[0].id, students[1].id, students[2].id, lessons[1].id, lessons[2].id, lessons[3].id]);
            }
        }
        
        console.log('Inserting earnings...');
        
        // Insert earnings
        if (teachers.length >= 2) {
            await client.query(`
                INSERT INTO earnings (teacher_id, amount, date, description) VALUES
                ($1, 5000.00, CURRENT_DATE, 'Monthly salary'),
                ($2, 4500.00, CURRENT_DATE, 'Monthly salary'),
                ($1, 2000.00, CURRENT_DATE - INTERVAL '1 day', 'Bonus'),
                ($2, 1500.00, CURRENT_DATE - INTERVAL '2 days', 'Bonus');
            `, [teachers[0].id, teachers[1].id]);
        }
        
        console.log('Inserting services...');
        
        // Get partner ID
        const partnerResult = await client.query(`
            SELECT id FROM users WHERE role = 'partner'
        `);
        const partner = partnerResult.rows[0];
        
        if (partner) {
            // Insert services
            await client.query(`
                INSERT INTO services (partner_id, name, description, price) VALUES
                ($1, 'Web Development', 'Custom website development services', 50000.00),
                ($1, 'Mobile App Development', 'iOS and Android app development', 75000.00),
                ($1, 'Digital Marketing', 'Social media and SEO marketing', 25000.00),
                ($1, 'Cloud Consulting', 'AWS and cloud infrastructure setup', 40000.00);
            `, [partner.id]);
        }
        
        console.log('Inserting bookings...');
        
        // Get service IDs
        const serviceResult = await client.query(`
            SELECT id FROM services LIMIT 2
        `);
        const services = serviceResult.rows;
        
        if (services.length >= 2 && partner) {
            await client.query(`
                INSERT INTO bookings (partner_id, customer_name, service_id, date, status) VALUES
                ($1, 'Acme Corp', $2, CURRENT_DATE + INTERVAL '5 days', 'booked'),
                ($1, 'Tech Startup', $3, CURRENT_DATE + INTERVAL '3 days', 'booked'),
                ($1, 'Enterprise Inc', $2, CURRENT_DATE - INTERVAL '1 day', 'completed'),
                ($1, 'Small Business', $4, CURRENT_DATE - INTERVAL '5 days', 'completed');
            `, [partner.id, services[0].id, services[1].id]);
        }
        
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
        if (client) client.release();
        await pool.end();
    }
}

seedDatabase();
