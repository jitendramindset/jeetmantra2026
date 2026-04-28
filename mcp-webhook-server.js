const path = require('path');
const Database = require('better-sqlite3');
const express = require('express');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'jeetmantra.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Add vector embeddings table
db.exec(`
    CREATE TABLE IF NOT EXISTS vector_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id INTEGER NOT NULL,
        embedding_type TEXT DEFAULT 'content',
        vector TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entity_type, entity_id, embedding_type)
    );
`);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ============================================
// UNIFIED WEBHOOK ENDPOINT
// ============================================
// Single webhook that handles all actions
app.post('/api/webhook', (req, res) => {
    const { action, identity, data, userId, role, timestamp } = req.body;
    
    if (!action || !identity) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: action, identity'
        });
    }

    try {
        // Route to appropriate handler based on action
        const handlers = {
            'auth.login': handleLogin,
            'auth.logout': handleLogout,
            'dashboard.fetch': handleFetchDashboard,
            'course.list': handleListCourses,
            'course.create': handleCreateCourse,
            'course.update': handleUpdateCourse,
            'lesson.list': handleListLessons,
            'lesson.create': handleCreateLesson,
            'lesson.update': handleUpdateLesson,
            'attendance.record': handleRecordAttendance,
            'attendance.list': handleListAttendance,
            'earnings.fetch': handleFetchEarnings,
            'service.list': handleListServices,
            'service.create': handleCreateService,
            'booking.create': handleCreateBooking,
            'booking.list': handleListBookings,
            'user.update': handleUpdateUser,
            'user.profile': handleGetUserProfile,
            'search.vector': handleVectorSearch,
            'content.process': handleProcessContent,
        };

        const handler = handlers[action];
        
        if (!handler) {
            return res.status(400).json({
                success: false,
                error: `Unknown action: ${action}`,
                availableActions: Object.keys(handlers)
            });
        }

        // Execute handler
        const result = handler({ action, identity, data, userId, role, timestamp });
        
        res.json({
            success: true,
            action,
            identity,
            timestamp: new Date().toISOString(),
            data: result
        });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            action,
            timestamp: new Date().toISOString()
        });
    }
});

// ============================================
// HANDLER FUNCTIONS
// ============================================

function handleLogin({ data }) {
    const { email } = data;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const session = {
        token,
        user_id: user.id,
        role: user.role,
        created_at: new Date().toISOString()
    };
    
    return { user, session };
}

function handleLogout({ identity }) {
    // Invalidate session in production
    return { message: 'Logged out successfully' };
}

function handleFetchDashboard({ userId, role }) {
    const dashboardData = {
        'student': () => db.prepare(`
            SELECT c.*, COUNT(DISTINCT e.student_id) as total_students
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?
            GROUP BY c.id
        `).all(userId),
        'teacher': () => db.prepare(`
            SELECT c.id, c.title, c.description,
                   COUNT(DISTINCT e.student_id) as enrolled_students,
                   COUNT(DISTINCT a.student_id) as present_today,
                   COALESCE(SUM(ear.amount), 0) as total_earnings
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            LEFT JOIN lessons l ON c.id = l.course_id
            LEFT JOIN attendance a ON l.id = a.lesson_id AND a.date = date('now')
            LEFT JOIN earnings ear ON c.teacher_id = ear.teacher_id
            WHERE c.teacher_id = ?
            GROUP BY c.id
        `).all(userId),
        'partner': () => db.prepare(`
            SELECT s.*, 
                   COUNT(b.id) as total_bookings,
                   COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed
            FROM services s
            LEFT JOIN bookings b ON s.id = b.service_id
            WHERE s.partner_id = ?
            GROUP BY s.id
        `).all(userId),
        'superadmin': () => ({
            total_users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
            students: db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('student').c,
            teachers: db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('teacher').c,
            courses: db.prepare('SELECT COUNT(*) as c FROM courses').get().c,
            bookings: db.prepare('SELECT COUNT(*) as c FROM bookings').get().c
        }),
        'admin': () => ({
            total_users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
            students: db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('student').c,
            teachers: db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get('teacher').c,
            courses: db.prepare('SELECT COUNT(*) as c FROM courses').get().c,
            bookings: db.prepare('SELECT COUNT(*) as c FROM bookings').get().c
        })
    };

    const fn = dashboardData[role] || dashboardData['admin'];
    return fn();
}

function handleListCourses() {
    return db.prepare(`
        SELECT c.*, u.name as teacher_name
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        ORDER BY c.created_at DESC
    `).all();
}

function handleCreateCourse({ data, userId }) {
    const { title, description } = data;
    db.prepare(`
        INSERT INTO courses (title, description, teacher_id)
        VALUES (?, ?, ?)
    `).run(title, description, userId);
    
    return { message: 'Course created successfully' };
}

function handleUpdateCourse({ data, userId }) {
    const { id, title, description } = data;
    db.prepare(`
        UPDATE courses SET title = ?, description = ?
        WHERE id = ? AND teacher_id = ?
    `).run(title, description, id, userId);
    
    return { message: 'Course updated successfully' };
}

function handleListLessons({ data }) {
    const { course_id } = data;
    return db.prepare(`
        SELECT * FROM lessons
        WHERE course_id = ?
        ORDER BY scheduled_date
    `).all(course_id);
}

function handleCreateLesson({ data, userId }) {
    const { course_id, title, content, scheduled_date } = data;
    
    // Verify ownership
    const course = db.prepare('SELECT teacher_id FROM courses WHERE id = ?').get(course_id);
    if (course.teacher_id !== userId) {
        throw new Error('Unauthorized');
    }
    
    db.prepare(`
        INSERT INTO lessons (course_id, title, content, scheduled_date)
        VALUES (?, ?, ?, ?)
    `).run(course_id, title, content, scheduled_date);
    
    return { message: 'Lesson created successfully' };
}

function handleUpdateLesson({ data, userId }) {
    const { id, title, content, scheduled_date } = data;
    
    db.prepare(`
        UPDATE lessons SET title = ?, content = ?, scheduled_date = ?
        WHERE id = ?
    `).run(title, content, scheduled_date, id);
    
    return { message: 'Lesson updated successfully' };
}

function handleRecordAttendance({ data, userId }) {
    const { student_id, lesson_id, date, status } = data;
    
    db.prepare(`
        INSERT OR REPLACE INTO attendance 
        (teacher_id, student_id, lesson_id, date, status)
        VALUES (?, ?, ?, ?, ?)
    `).run(userId, student_id, lesson_id, date, status);
    
    return { message: 'Attendance recorded' };
}

function handleListAttendance({ data, userId }) {
    const { lesson_id } = data;
    return db.prepare(`
        SELECT * FROM attendance
        WHERE lesson_id = ? AND teacher_id = ?
    `).all(lesson_id, userId);
}

function handleFetchEarnings({ userId }) {
    const total = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total FROM earnings WHERE teacher_id = ?
    `).get(userId).total;
    
    const monthly = db.prepare(`
        SELECT * FROM earnings 
        WHERE teacher_id = ? 
        ORDER BY date DESC 
        LIMIT 30
    `).all(userId);
    
    return { total, monthly };
}

function handleListServices({ data }) {
    const { partner_id } = data;
    return db.prepare(`
        SELECT * FROM services WHERE partner_id = ?
    `).all(partner_id);
}

function handleCreateService({ data, userId }) {
    const { name, description, price } = data;
    db.prepare(`
        INSERT INTO services (partner_id, name, description, price)
        VALUES (?, ?, ?, ?)
    `).run(userId, name, description, price);
    
    return { message: 'Service created successfully' };
}

function handleCreateBooking({ data, userId }) {
    const { service_id, customer_name, date } = data;
    db.prepare(`
        INSERT INTO bookings (partner_id, customer_name, service_id, date, status)
        VALUES (?, ?, ?, ?, 'booked')
    `).run(userId, customer_name, service_id, date);
    
    return { message: 'Booking created successfully' };
}

function handleListBookings({ userId }) {
    return db.prepare(`
        SELECT b.*, s.name as service_name, s.price
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.partner_id = ?
        ORDER BY b.date DESC
    `).all(userId);
}

function handleUpdateUser({ data, userId }) {
    const { name, language_pref, theme_pref, accent_color } = data;
    db.prepare(`
        UPDATE users 
        SET name = COALESCE(?, name),
            language_pref = COALESCE(?, language_pref),
            theme_pref = COALESCE(?, theme_pref),
            accent_color = COALESCE(?, accent_color)
        WHERE id = ?
    `).run(name, language_pref, theme_pref, accent_color, userId);
    
    return { message: 'User updated successfully' };
}

function handleGetUserProfile({ userId }) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

function handleVectorSearch({ data }) {
    const { query, entity_type, limit = 10 } = data;
    
    // Simple text search (in production, use actual vector embeddings)
    return db.prepare(`
        SELECT * FROM vector_data
        WHERE entity_type = ? OR entity_type IS NULL
        LIMIT ?
    `).all(entity_type || null, limit);
}

function handleProcessContent({ data }) {
    const { content_type, content_data } = data;
    
    // Process and store content
    return { 
        processed: true,
        message: 'Content processed successfully'
    };
}

// ============================================
// LEGACY API ROUTES (for compatibility)
// ============================================

app.post('/api/login', (req, res) => {
    try {
        const result = handleLogin({ data: req.body });
        res.json({ success: true, user: result.user, session: result.session });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
});

app.post('/api/get_user_dashboard', (req, res) => {
    try {
        const { user_id, role } = req.body;
        const data = handleFetchDashboard({ userId: user_id, role });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/courses', (req, res) => {
    try {
        const data = handleListCourses();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'JeetMantra-AllRoles.html'));
        }
    });
});

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
    console.log(`\n✅ JeetMantra MCP Webhook Server running on http://localhost:${PORT}`);
    console.log(`📨 Webhook Endpoint: http://localhost:${PORT}/api/webhook`);
    console.log(`📱 Open http://localhost:${PORT} in your browser\n`);
});
