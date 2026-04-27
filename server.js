const path = require('path');
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const { Pool } = require('pg');
const express = require('express');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'JeetMantra-AllRoles.html'));
        }
    });
});

const tools = [
    {
        name: "get_user_dashboard",
        description: "Fetches dashboard data based on user role",
        inputSchema: {
            type: "object",
            properties: {
                user_id: { type: "integer" },
                role: { type: "string", enum: ["student", "teacher", "partner", "superadmin", "admin", "institute", "branch", "school"] }
            },
            required: ["user_id", "role"]
        }
    },
    {
        name: "update_user_settings",
        description: "Updates user preferences (language, theme, accent color)",
        inputSchema: {
            type: "object",
            properties: {
                user_id: { type: "integer" },
                language_pref: { type: "string" },
                theme_pref: { type: "string", enum: ["light", "dark"] },
                accent_color: { type: "string" }
            },
            required: ["user_id"]
        }
    },
    {
        name: "manage_attendance",
        description: "Log or update student attendance for a lesson",
        inputSchema: {
            type: "object",
            properties: {
                teacher_id: { type: "integer" },
                student_id: { type: "integer" },
                lesson_id: { type: "integer" },
                date: { type: "string", format: "date" },
                status: { type: "string", enum: ["present", "absent"] }
            },
            required: ["teacher_id", "student_id", "lesson_id", "status"]
        }
    },
    {
        name: "book_service",
        description: "Book a service session for a customer",
        inputSchema: {
            type: "object",
            properties: {
                partner_id: { type: "integer" },
                customer_name: { type: "string" },
                service_id: { type: "integer" },
                date: { type: "string", format: "date" }
            },
            required: ["partner_id", "customer_name", "service_id", "date"]
        }
    },
    {
        name: "get_courses",
        description: "Retrieve all available courses",
        inputSchema: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "get_services",
        description: "Retrieve all available services",
        inputSchema: {
            type: "object",
            properties: {}
        }
    }
];

const server = new Server(
    {
        name: "jeetmantra-mcp-server",
        version: "1.0.0"
    },
    {
        capabilities: {
            tools: {}
        }
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "get_user_dashboard":
                return await handleGetUserDashboard(args);
            case "update_user_settings":
                return await handleUpdateUserSettings(args);
            case "manage_attendance":
                return await handleManageAttendance(args);
            case "book_service":
                return await handleBookService(args);
            case "get_courses":
                return await handleGetCourses();
            case "get_services":
                return await handleGetServices();
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true
        };
    }
});

// Handler implementations
async function handleGetUserDashboard(args) {
    const { user_id, role } = args;
    let query, params;
    
    switch (role) {
        case "student":
            query = `
                SELECT c.title, c.description, l.title as lesson_title, l.scheduled_date,
                       a.status as attendance_status
                FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                LEFT JOIN lessons l ON c.id = l.course_id
                LEFT JOIN attendance a ON l.id = a.lesson_id AND a.student_id = e.student_id
                WHERE e.student_id = $1
                ORDER BY l.scheduled_date DESC
            `;
            params = [user_id];
            break;
        case "teacher":
            query = `
                SELECT c.title, c.description,
                       COUNT(DISTINCT e.student_id) as enrolled_students,
                       COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.student_id END) as present_today,
                       COALESCE(SUM(ear.amount), 0) as total_earnings
                FROM courses c
                LEFT JOIN enrollments e ON c.id = e.course_id
                LEFT JOIN lessons l ON c.id = l.course_id
                LEFT JOIN attendance a ON l.id = a.lesson_id AND a.date = CURRENT_DATE
                LEFT JOIN earnings ear ON c.teacher_id = ear.teacher_id
                WHERE c.teacher_id = $1
                GROUP BY c.id, c.title, c.description
            `;
            params = [user_id];
            break;
        case "partner":
            query = `
                SELECT s.name, s.description, s.price,
                       COUNT(b.id) as total_bookings,
                       COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_sessions
                FROM services s
                LEFT JOIN bookings b ON s.id = b.service_id
                WHERE s.partner_id = $1
                GROUP BY s.id, s.name, s.description, s.price
            `;
            params = [user_id];
            break;
        case "superadmin":
        case "admin":
            query = `
                SELECT
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM users WHERE role = 'student') as students,
                    (SELECT COUNT(*) FROM users WHERE role = 'teacher') as teachers,
                    (SELECT COUNT(*) FROM users WHERE role = 'partner') as partners,
                    (SELECT COUNT(*) FROM courses) as total_courses,
                    (SELECT COUNT(*) FROM bookings) as total_bookings
            `;
            params = [];
            break;
        case "institute":
        case "branch":
        case "school":
            query = `
                SELECT u.id, u.name, u.role, u.email, u.language_pref, u.theme_pref, u.accent_color
                FROM users u
                WHERE u.id = $1
            `;
            params = [user_id];
            break;
        default:
            query = `SELECT id, role, name, email FROM users WHERE id = $1`;
            params = [user_id];
            break;
    }
    
    const result = await pool.query(query, params);
    return {
        content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }]
    };
}

async function handleUpdateUserSettings(args) {
    const { user_id, language_pref, theme_pref, accent_color } = args;
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (language_pref !== undefined) {
        updates.push(`language_pref = $${paramIndex++}`);
        params.push(language_pref);
    }
    if (theme_pref !== undefined) {
        updates.push(`theme_pref = $${paramIndex++}`);
        params.push(theme_pref);
    }
    if (accent_color !== undefined) {
        updates.push(`accent_color = $${paramIndex++}`);
        params.push(accent_color);
    }
    
    if (updates.length === 0) {
        throw new Error("No settings to update");
    }
    
    params.push(user_id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    
    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
        throw new Error("User not found");
    }
    
    return {
        content: [{ type: "text", text: "User settings updated successfully" }]
    };
}

async function handleManageAttendance(args) {
    const { teacher_id, student_id, lesson_id, date, status } = args;
    
    // Verify teacher owns the lesson
    const checkQuery = `
        SELECT 1 FROM lessons l
        JOIN courses c ON l.course_id = c.id
        WHERE l.id = $1 AND c.teacher_id = $2
    `;
    const check = await pool.query(checkQuery, [lesson_id, teacher_id]);
    if (check.rows.length === 0) {
        throw new Error("Unauthorized: Teacher does not own this lesson");
    }
    
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const query = `
        INSERT INTO attendance (teacher_id, student_id, lesson_id, date, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (teacher_id, student_id, lesson_id, date)
        DO UPDATE SET status = EXCLUDED.status
    `;
    
    await pool.query(query, [teacher_id, student_id, lesson_id, attendanceDate, status]);
    return {
        content: [{ type: "text", text: "Attendance recorded successfully" }]
    };
}

async function handleBookService(args) {
    const { partner_id, customer_name, service_id, date } = args;
    
    // Verify partner owns the service
    const checkQuery = `SELECT 1 FROM services WHERE id = $1 AND partner_id = $2`;
    const check = await pool.query(checkQuery, [service_id, partner_id]);
    if (check.rows.length === 0) {
        throw new Error("Unauthorized: Partner does not own this service");
    }
    
    const query = `
        INSERT INTO bookings (partner_id, customer_name, service_id, date, status)
        VALUES ($1, $2, $3, $4, 'booked')
    `;
    
    await pool.query(query, [partner_id, customer_name, service_id, date]);
    return {
        content: [{ type: "text", text: "Service booking created successfully" }]
    };
}

async function handleGetCourses() {
    const query = `
        SELECT c.*, u.name as teacher_name
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        ORDER BY c.title
    `;
    const result = await pool.query(query);
    return {
        content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }]
    };
}

async function handleGetServices() {
    const query = `
        SELECT s.*, u.name as partner_name
        FROM services s
        JOIN users u ON s.partner_id = u.id
        ORDER BY s.name
    `;
    const result = await pool.query(query);
    return {
        content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }]
    };
}

// HTTP API routes for frontend integration
app.post('/api/get_user_dashboard', async (req, res) => {
    try {
        const result = await handleGetUserDashboard(req.body);
        res.json({ success: true, data: JSON.parse(result.content[0].text) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/update_user_settings', async (req, res) => {
    try {
        const result = await handleUpdateUserSettings(req.body);
        res.json({ success: true, message: result.content[0].text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/manage_attendance', async (req, res) => {
    try {
        const result = await handleManageAttendance(req.body);
        res.json({ success: true, message: result.content[0].text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/book_service', async (req, res) => {
    try {
        const result = await handleBookService(req.body);
        res.json({ success: true, message: result.content[0].text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const result = await handleGetCourses();
        res.json({ success: true, data: JSON.parse(result.content[0].text) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const result = await handleGetServices();
        res.json({ success: true, data: JSON.parse(result.content[0].text) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT id, role, name, email FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/dashboard', async (req, res) => {
    const { role, userId } = req.query;
    try {
        const result = await handleGetUserDashboard({ user_id: parseInt(userId), role });
        res.json({ success: true, data: JSON.parse(result.content[0].text) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'JeetMantra-AllRoles.html'));
        }
    });
});

async function main() {
    // Start HTTP server for frontend
    app.listen(3000, () => console.log('HTTP API server listening on port 3000'));
    
    // Start MCP server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("JeetMantra MCP server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});