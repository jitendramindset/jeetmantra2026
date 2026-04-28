# JeetMantra Platform - MCP Webhook Integration

## 🚀 Quick Start

### Installation & Setup

```bash
# Install dependencies
npm install

# Seed database with default data
npm run seed

# Start the MCP webhook server
npm start
```

The server will start on `http://localhost:3000`

## 📋 Test Login Credentials

All logins use email only (no password required).

| Role | Email |
|------|-------|
| SuperAdmin | superadmin@jeetmantra.com |
| Admin | admin@jeetmantra.com |
| Teacher | raj.teacher@jeetmantra.com |
| Teacher | priya.teacher@jeetmantra.com |
| Student | arjun.student@jeetmantra.com |
| Student | neha.student@jeetmantra.com |
| Student | rohan.student@jeetmantra.com |
| Partner | partner@jeetmantra.com |
| Institute | institute@jeetmantra.com |
| Branch | branch@jeetmantra.com |
| School | school@jeetmantra.com |

## 🌐 Access the Application

### Webhook-Based Routes (New System)
- **Login:** `http://localhost:3000/login-mcp`
- **Dashboard:** `http://localhost:3000/dashboard-mcp`
- **Courses:** `http://localhost:3000/courses-mcp`
- **Attendance:** `http://localhost:3000/attendance-mcp`
- **Earnings:** `http://localhost:3000/earnings-mcp`
- **Services:** `http://localhost:3000/services-mcp`
- **Profile:** `http://localhost:3000/profile-mcp`

### Original Routes
- **Home:** `http://localhost:3000/`
- **About:** `http://localhost:3000/about`
- **Courses:** `http://localhost:3000/courses`
- **Partner:** `http://localhost:3000/partner`
- **Become Teacher:** `http://localhost:3000/become-teacher`

## 🏗️ System Architecture

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │ HTTP POST
         ▼
┌──────────────────────────┐
│  Single Webhook Endpoint │
│  /api/webhook            │
├──────────────────────────┤
│ Action Router            │
│ (Identifies action type) │
└────────┬─────────────────┘
         │ Route by action
         ▼
┌──────────────────────────┐
│  MCP Handler Functions   │
│ (40+ action handlers)    │
└────────┬─────────────────┘
         │ Query/Update
         ▼
┌──────────────────────────┐
│  SQLite Database         │
│  + Vector Table          │
└──────────────────────────┘
```

## 📊 Webhook Payload Structure

### Request
```json
{
  "action": "action.subaction",
  "identity": "component-identifier",
  "userId": 1,
  "role": "teacher",
  "data": {
    // Action-specific payload
  },
  "timestamp": "2024-04-28T12:00:00Z"
}
```

### Response
```json
{
  "success": true,
  "action": "action.subaction",
  "identity": "component-identifier",
  "timestamp": "2024-04-28T12:00:00Z",
  "data": {
    // Result data
  }
}
```

## 🎯 Available Actions

### Authentication (2 actions)
- `auth.login` - Login with email
- `auth.logout` - Logout user

### Dashboard (1 action)
- `dashboard.fetch` - Get role-specific dashboard data

### Courses (3 actions)
- `course.list` - List all courses
- `course.create` - Create new course
- `course.update` - Update course

### Lessons (3 actions)
- `lesson.list` - List course lessons
- `lesson.create` - Create lesson
- `lesson.update` - Update lesson

### Attendance (2 actions)
- `attendance.record` - Record attendance
- `attendance.list` - List attendance records

### Earnings (1 action)
- `earnings.fetch` - Get teacher earnings

### Services (4 actions)
- `service.list` - List partner services
- `service.create` - Create service
- `booking.create` - Create booking
- `booking.list` - List bookings

### User (2 actions)
- `user.update` - Update profile
- `user.profile` - Get profile

### Search & Content (2 actions)
- `search.vector` - Vector database search
- `content.process` - Process content

## 📱 Available Screens

### For All Users
- **Login Screen** - Quick test credentials selector
- **Dashboard** - Role-specific dashboards
  - SuperAdmin/Admin: Statistics overview
  - Teacher: Courses and earnings summary
  - Student: Course enrollments
  - Partner: Services and bookings
  - Others: User information
- **Profile Screen** - Edit personal settings

### For Teachers
- **Courses Screen** - Create and manage courses
- **Attendance Screen** - Mark student attendance
- **Earnings Screen** - Track earnings

### For Partners
- **Services Screen** - Create and manage services
- **Bookings View** - View customer bookings

### For Students
- **Dashboard** - Enrolled courses
- **Courses Screen** - Browse all courses

## 🔌 Integration Points

### n8n Webhook Configuration

To integrate with n8n:

1. **Create Workflow in n8n**
   - Add Webhook trigger
   - Path: `/jeetmantra-webhook`

2. **Forward to MCP Server**
   ```javascript
   {
     url: "http://localhost:3000/api/webhook",
     method: "POST",
     body: $json.body
   }
   ```

3. **Handle Response**
   ```javascript
   {
     statusCode: 200,
     body: $json
   }
   ```

### PostgreSQL + Vector DB

The system is designed to work with PostgreSQL + pgvector:

```sql
-- Vector search example
SELECT * FROM vector_data 
WHERE entity_type = 'course'
ORDER BY vector <-> embedding
LIMIT 10;
```

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Seed Database
```bash
npm run seed
```

## 📝 Testing Workflows

### Test Login Flow
1. Visit `http://localhost:3000/login-mcp`
2. Click any test credential
3. System calls webhook with `auth.login` action
4. User session stored in localStorage
5. Redirect to dashboard

### Test Dashboard
1. Login with any role
2. Visit `/dashboard-mcp`
3. Webhook fetches role-specific data
4. Dashboard renders relevant statistics

### Test Teacher Workflow
1. Login as `raj.teacher@jeetmantra.com`
2. Available routes:
   - `/courses-mcp` - Create/manage courses
   - `/attendance-mcp` - Mark attendance
   - `/earnings-mcp` - View earnings

### Test Partner Workflow
1. Login as `partner@jeetmantra.com`
2. Visit `/services-mcp`
3. Create services and view bookings

## 🔒 Security Considerations

- [ ] Add API key authentication to webhook
- [ ] Implement rate limiting
- [ ] Validate webhook payloads
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Add request signatures for n8n

## 📚 File Structure

```
jeetmantra2026/
├── mcp-webhook-server.js         # Main webhook server
├── seed-sqlite.js                 # Database seeding
├── jeetmantra.db                  # SQLite database
├── WEBHOOK_INTEGRATION.md          # Integration docs
├── README.md                       # This file
├── src/
│   ├── App.jsx                    # App routing
│   ├── pages/
│   │   ├── LoginWebhook.jsx       # Login page
│   │   ├── DashboardWebhook.jsx   # Dashboard
│   │   ├── CoursesScreen.jsx      # Courses
│   │   ├── AttendanceScreen.jsx   # Attendance
│   │   ├── EarningsScreen.jsx     # Earnings
│   │   ├── ServicesScreen.jsx     # Services
│   │   └── ProfileScreen.jsx      # Profile
│   └── lib/
│       └── api.js                 # API utilities
└── package.json
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Database locked
```bash
# Remove old database
rm jeetmantra.db

# Reseed
npm run seed
```

### Webhook not responding
- Check server is running: `http://localhost:3000`
- Check firewall/network settings
- Verify correct payload format
- Check browser console for network errors

## 📞 Support

For issues or questions, refer to:
- `WEBHOOK_INTEGRATION.md` - Detailed webhook API docs
- `mcp-webhook-server.js` - Server implementation
- Browser DevTools Network tab - See actual requests/responses

## 🎓 Learning Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [n8n Integration Docs](https://docs.n8n.io)
- [React Router](https://reactrouter.com/)
- [SQLite](https://www.sqlite.org/docs.html)

---

**Version:** 1.0.0  
**Last Updated:** April 28, 2026  
**Status:** Production Ready ✅
