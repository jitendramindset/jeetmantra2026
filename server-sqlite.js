const path = require('path');
const Database = require('better-sqlite3');
const express = require('express');

const dbPath = path.join(__dirname, 'jeetmantra.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for root
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'JeetMantra-AllRoles.html'));
        }
    });
});

// API Routes

// Login route
app.post('/api/login', (req, res) => {
    const { email } = req.body;
    try {
        const user = db.prepare('SELECT id, role, name, email FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user dashboard
app.post('/api/get_user_dashboard', (req, res) => {
    const { user_id, role } = req.body;
    try {
        let data = [];
        
        switch (role) {
            case 'student':
                data = db.prepare(`
                    SELECT c.title, c.description, l.title as lesson_title, l.scheduled_date,
                           a.status as attendance_status
                    FROM enrollments e
                    JOIN courses c ON e.course_id = c.id
                    LEFT JOIN lessons l ON c.id = l.course_id
                    LEFT JOIN attendance a ON l.id = a.lesson_id AND a.student_id = e.student_id
                    WHERE e.student_id = ?
                    ORDER BY l.scheduled_date DESC
                `).all(user_id);
                break;
            case 'teacher':
                data = db.prepare(`
                    SELECT c.id, c.title, c.description,
                           COUNT(DISTINCT e.student_id) as enrolled_students,
                           COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.student_id END) as present_today,
                           COALESCE(SUM(ear.amount), 0) as total_earnings
                    FROM courses c
                    LEFT JOIN enrollments e ON c.id = e.course_id
                    LEFT JOIN lessons l ON c.id = l.course_id
                    LEFT JOIN attendance a ON l.id = a.lesson_id AND a.date = date('now')
                    LEFT JOIN earnings ear ON c.teacher_id = ear.teacher_id
                    WHERE c.teacher_id = ?
                    GROUP BY c.id, c.title, c.description
                `).all(user_id);
                break;
            case 'partner':
                data = db.prepare(`
                    SELECT s.id, s.name, s.description, s.price,
                           COUNT(b.id) as total_bookings,
                           COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_sessions
                    FROM services s
                    LEFT JOIN bookings b ON s.id = b.service_id
                    WHERE s.partner_id = ?
                    GROUP BY s.id, s.name, s.description, s.price
                `).all(user_id);
                break;
            case 'superadmin':
            case 'admin':
                data = [{
                    total_users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
                    students: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('student').count,
                    teachers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('teacher').count,
                    partners: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('partner').count,
                    total_courses: db.prepare('SELECT COUNT(*) as count FROM courses').get().count,
                    total_bookings: db.prepare('SELECT COUNT(*) as count FROM bookings').get().count
                }];
                break;
            case 'institute':
            case 'branch':
            case 'school':
                data = db.prepare(`
                    SELECT id, role, name, email, language_pref, theme_pref, accent_color
                    FROM users
                    WHERE id = ?
                `).all(user_id);
                break;
            default:
                data = db.prepare(`SELECT id, role, name, email FROM users WHERE id = ?`).all(user_id);
        }
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update user settings
app.post('/api/update_user_settings', (req, res) => {
    const { user_id, language_pref, theme_pref, accent_color } = req.body;
    try {
        const updates = [];
        const params = [];
        
        if (language_pref !== undefined) {
            updates.push('language_pref = ?');
            params.push(language_pref);
        }
        if (theme_pref !== undefined) {
            updates.push('theme_pref = ?');
            params.push(theme_pref);
        }
        if (accent_color !== undefined) {
            updates.push('accent_color = ?');
            params.push(accent_color);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No settings to update' });
        }
        
        params.push(user_id);
        const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
        const result = stmt.run(...params);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        res.json({ success: true, message: 'User settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manage attendance
app.post('/api/manage_attendance', (req, res) => {
    const { teacher_id, student_id, lesson_id, date, status } = req.body;
    try {
        // Verify teacher owns the lesson
        const check = db.prepare(`
            SELECT 1 FROM lessons l
            JOIN courses c ON l.course_id = c.id
            WHERE l.id = ? AND c.teacher_id = ?
        `).get(lesson_id, teacher_id);
        
        if (!check) {
            return res.status(403).json({ success: false, error: 'Unauthorized: Teacher does not own this lesson' });
        }
        
        const attendanceDate = date || new Date().toISOString().split('T')[0];
        
        // Insert or update attendance
        db.prepare(`
            INSERT OR REPLACE INTO attendance (teacher_id, student_id, lesson_id, date, status)
            VALUES (?, ?, ?, ?, ?)
        `).run(teacher_id, student_id, lesson_id, attendanceDate, status);
        
        res.json({ success: true, message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Book service
app.post('/api/book_service', (req, res) => {
    const { partner_id, customer_name, service_id, date } = req.body;
    try {
        // Verify partner owns the service
        const check = db.prepare(`SELECT 1 FROM services WHERE id = ? AND partner_id = ?`).get(service_id, partner_id);
        
        if (!check) {
            return res.status(403).json({ success: false, error: 'Unauthorized: Partner does not own this service' });
        }
        
        db.prepare(`
            INSERT INTO bookings (partner_id, customer_name, service_id, date, status)
            VALUES (?, ?, ?, ?, 'booked')
        `).run(partner_id, customer_name, service_id, date);
        
        res.json({ success: true, message: 'Service booking created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get courses
app.get('/api/courses', (req, res) => {
    try {
        const data = db.prepare(`
            SELECT c.*, u.name as teacher_name
            FROM courses c
            JOIN users u ON c.teacher_id = u.id
            ORDER BY c.title
        `).all();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get services
app.get('/api/services', (req, res) => {
    try {
        const data = db.prepare(`
            SELECT s.*, u.name as partner_name
            FROM services s
            JOIN users u ON s.partner_id = u.id
            ORDER BY s.name
        `).all();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get dashboard
app.get('/api/dashboard', (req, res) => {
    const { role, userId } = req.query;
    try {
        let data = [];
        
        switch (role) {
            case 'student':
                data = db.prepare(`
                    SELECT c.title, c.description, l.title as lesson_title, l.scheduled_date,
                           a.status as attendance_status
                    FROM enrollments e
                    JOIN courses c ON e.course_id = c.id
                    LEFT JOIN lessons l ON c.id = l.course_id
                    LEFT JOIN attendance a ON l.id = a.lesson_id AND a.student_id = e.student_id
                    WHERE e.student_id = ?
                    ORDER BY l.scheduled_date DESC
                `).all(parseInt(userId));
                break;
            case 'teacher':
                data = db.prepare(`
                    SELECT c.id, c.title, c.description,
                           COUNT(DISTINCT e.student_id) as enrolled_students,
                           COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.student_id END) as present_today,
                           COALESCE(SUM(ear.amount), 0) as total_earnings
                    FROM courses c
                    LEFT JOIN enrollments e ON c.id = e.course_id
                    LEFT JOIN lessons l ON c.id = l.course_id
                    LEFT JOIN attendance a ON l.id = a.lesson_id AND a.date = date('now')
                    LEFT JOIN earnings ear ON c.teacher_id = ear.teacher_id
                    WHERE c.teacher_id = ?
                    GROUP BY c.id, c.title, c.description
                `).all(parseInt(userId));
                break;
            default:
                data = db.prepare(`SELECT id, role, name, email FROM users WHERE id = ?`).all(parseInt(userId));
        }
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Catch-all for SPA
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'JeetMantra-AllRoles.html'));
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ JeetMantra Server running on http://localhost:${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser\n`);
});
