# JeetMantra MCP Webhook Integration Guide

## Architecture Overview

```
Frontend (React) 
    ↓ (HTTP Request)
Webhook Endpoint (/api/webhook)
    ↓ (JSON Payload)
MCP Server (Unified Router)
    ↓ (Action Handler)
PostgreSQL/SQLite Database
    ↓ (Query/Vector Search)
Response (JSON)
    ↓ (HTTP Response)
Frontend UI Update
```

## Unified Webhook Endpoint

**Base URL:** `http://localhost:3000/api/webhook`
**Method:** `POST`
**Content-Type:** `application/json`

### Request Payload Structure

```json
{
  "action": "action.subaction",
  "identity": "page-or-component-identifier",
  "userId": 1,
  "role": "teacher",
  "data": {
    // action-specific data
  },
  "timestamp": "2024-04-28T12:00:00.000Z"
}
```

### Response Structure

```json
{
  "success": true,
  "action": "action.subaction",
  "identity": "page-or-component-identifier",
  "timestamp": "2024-04-28T12:00:00.000Z",
  "data": {
    // action result data
  }
}
```

## Available Actions

### Authentication
- `auth.login` - Login with email
- `auth.logout` - Logout user

### Dashboard
- `dashboard.fetch` - Get dashboard data based on role

### Courses
- `course.list` - List all courses
- `course.create` - Create new course (teacher)
- `course.update` - Update course (teacher)

### Lessons
- `lesson.list` - List lessons for a course
- `lesson.create` - Create lesson (teacher)
- `lesson.update` - Update lesson (teacher)

### Attendance
- `attendance.record` - Record student attendance
- `attendance.list` - Get attendance records

### Earnings
- `earnings.fetch` - Get teacher earnings

### Services (Partner)
- `service.list` - List partner services
- `service.create` - Create new service
- `booking.create` - Create new booking
- `booking.list` - Get bookings

### User
- `user.update` - Update user profile
- `user.profile` - Get user profile

### Search & Content
- `search.vector` - Vector search (for AI/ML features)
- `content.process` - Process content

## n8n Webhook Configuration

### Step 1: Create Webhook in n8n

1. Open n8n and create a new workflow
2. Add "Webhook" trigger node
3. Configure:
   - **Method:** POST
   - **Path:** `/jeetmantra-webhook`
   - **Authentication:** API Key or None (for testing)

### Step 2: Add MCP Processing Node

```javascript
// In n8n HTTP Request Node to call MCP Server
{
  url: "http://localhost:3000/api/webhook",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: $json.body  // Passes webhook payload to MCP
}
```

### Step 3: Database Interaction

Add "Execute Query" node to handle:
- PostgreSQL queries
- Vector embedding lookups
- Data processing

### Step 4: Response Handling

Configure response node to return data back to frontend:

```javascript
{
  statusCode: 200,
  body: {
    success: true,
    data: $json.data
  }
}
```

## Usage Examples

### Login Action
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth.login",
    "identity": "login-page",
    "data": {
      "email": "raj.teacher@jeetmantra.com"
    },
    "timestamp": "2024-04-28T12:00:00Z"
  }'
```

### Fetch Dashboard
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "dashboard.fetch",
    "identity": "dashboard-page",
    "userId": 3,
    "role": "teacher",
    "timestamp": "2024-04-28T12:00:00Z"
  }'
```

### Record Attendance
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "attendance.record",
    "identity": "attendance-page",
    "userId": 3,
    "role": "teacher",
    "data": {
      "student_id": 5,
      "lesson_id": 1,
      "date": "2024-04-28",
      "status": "present"
    },
    "timestamp": "2024-04-28T12:00:00Z"
  }'
```

## React Component Integration

### Hook Pattern
```javascript
const useWebhook = (action, data) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async (additionalData = {}) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:3000/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          identity: 'component-id',
          userId: user.id,
          role: user.role,
          data: { ...data, ...additionalData },
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setResult(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, call };
};
```

## Vector Database Integration

For AI/ML features, use the vector search action:

```javascript
const searchVector = async (query) => {
  const response = await fetch('http://localhost:3000/api/webhook', {
    method: 'POST',
    body: JSON.stringify({
      action: 'search.vector',
      identity: 'ai-search',
      data: {
        query,
        entity_type: 'course',
        limit: 10
      }
    })
  });
  return response.json();
};
```

## Security Considerations

1. **API Keys:** Add API key authentication to webhook endpoint
2. **Rate Limiting:** Implement rate limiting for webhook calls
3. **Validation:** Validate all incoming webhook payloads
4. **HTTPS:** Use HTTPS in production
5. **CORS:** Configure CORS properly
6. **Authentication:** Implement JWT token validation

## Environment Variables

```env
WEBHOOK_URL=http://localhost:3000/api/webhook
WEBHOOK_SECRET=your_secret_key
DATABASE_URL=postgresql://user:password@localhost/jeetmantra
N8N_HOST=http://localhost:5678
N8N_API_KEY=your_n8n_api_key
```

## Testing Screens & Login Credentials

### Test Accounts
- **SuperAdmin:** superadmin@jeetmantra.com
- **Admin:** admin@jeetmantra.com
- **Teacher:** raj.teacher@jeetmantra.com / priya.teacher@jeetmantra.com
- **Student:** arjun.student@jeetmantra.com / neha.student@jeetmantra.com
- **Partner:** partner@jeetmantra.com

### Screen Routes
- `/login` - Login page (test all credentials)
- `/dashboard` - Dashboard (role-specific content)
- `/courses` - Course management
- `/lessons` - Lesson management
- `/attendance` - Attendance recording (teacher only)
- `/earnings` - Earnings tracking (teacher only)
- `/services` - Partner services
- `/profile` - User profile management

## Troubleshooting

### Common Issues

1. **Webhook not receiving requests**
   - Check firewall/network access to port 3000
   - Verify URL is correct
   - Check n8n logs

2. **Database query failures**
   - Verify database connection
   - Check table existence
   - Review SQL syntax

3. **Vector search not working**
   - Ensure vector data table is populated
   - Check embedding format

### Debug Mode

Enable verbose logging:
```javascript
// In server-sqlite.js
const DEBUG = true;
if (DEBUG) console.log('Webhook payload:', req.body);
```

## References

- MCP Documentation: https://modelcontextprotocol.io
- n8n Documentation: https://docs.n8n.io
- PostgreSQL: https://www.postgresql.org/docs
- SQLite: https://www.sqlite.org/docs.html
