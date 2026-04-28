# JeetMantra Platform - Screen Guide

## 🎨 Available Screens & Features

### 1. Login Screen
**Route:** `http://localhost:3000/login-mcp`

**Features:**
- Email input field
- Quick login buttons for all test credentials
- Automatic role detection
- Session management via LocalStorage

**Test with:**
- Any credential from the list below

```
SuperAdmin:  superadmin@jeetmantra.com
Admin:       admin@jeetmantra.com
Teacher:     raj.teacher@jeetmantra.com
Student:     arjun.student@jeetmantra.com
Partner:     partner@jeetmantra.com
```

**Webhook Actions Used:**
- `auth.login` - Authenticates user and returns session

---

### 2. Dashboard Screen
**Route:** `http://localhost:3000/dashboard-mcp`

**Features:**
- Role-based content display
- Statistics cards
- Quick action buttons

**Displays Different Data By Role:**

#### SuperAdmin/Admin
- Total Users count
- Students count
- Teachers count
- Courses count
- Total Bookings

#### Teacher
- Courses with enrolled students
- Present count
- Total earnings

#### Student
- Enrolled courses
- Lesson titles
- Scheduled dates
- Attendance status

#### Partner
- Services with bookings
- Completed sessions count

**Webhook Actions Used:**
- `dashboard.fetch` - Fetches role-specific data

---

### 3. Courses Screen
**Route:** `http://localhost:3000/courses-mcp`

**Features:**
- List all courses with teacher names
- Create new course (Teachers only)
- Course cards with descriptions
- Edit functionality

**Components:**
- Course grid layout
- Course cards with hover effects
- Modal popup for course creation
- Form validation

**Webhook Actions Used:**
- `course.list` - Get all courses
- `course.create` - Create new course (Teacher)
- `course.update` - Update course (Teacher)

---

### 4. Attendance Screen
**Route:** `http://localhost:3000/attendance-mcp`

**Access:** Teachers only

**Features:**
- Lesson selector sidebar
- Student attendance table
- Mark Present/Absent buttons
- Real-time status updates

**Components:**
- Lesson list sidebar
- Attendance table with student names
- Status badges (Present/Absent)
- Interactive action buttons

**Workflow:**
1. Select a lesson from sidebar
2. View enrolled students
3. Click Present/Absent to record
4. Status updates immediately

**Webhook Actions Used:**
- `attendance.list` - Get attendance records
- `attendance.record` - Record attendance

---

### 5. Earnings Screen
**Route:** `http://localhost:3000/earnings-mcp`

**Access:** Teachers only

**Features:**
- Total earnings summary
- Monthly earnings table
- Transaction history
- Date-based sorting

**Components:**
- Summary cards showing totals
- Earnings table with dates
- Formatted currency display
- Transaction descriptions

**Data Displayed:**
- Total earnings amount
- Amount earned in last 30 days
- Transaction list with dates
- Amount per transaction

**Webhook Actions Used:**
- `earnings.fetch` - Get earnings data

---

### 6. Services Screen
**Route:** `http://localhost:3000/services-mcp`

**Access:** Partners only

**Features:**
- Create new service form
- Services grid display
- Service booking table
- Booking status management

**Components:**
- Service cards with prices
- Create service modal
- Bookings table
- Status badges (booked/completed)

**Actions:**
- Add new service (name, description, price)
- View all services
- View customer bookings
- Track booking status

**Webhook Actions Used:**
- `service.list` - Get partner services
- `service.create` - Create new service
- `booking.list` - Get bookings
- `booking.create` - Create booking

---

### 7. Profile Screen
**Route:** `http://localhost:3000/profile-mcp`

**Access:** All authenticated users

**Features:**
- View profile information
- Edit profile modal
- Settings management
- Preferences update

**Editable Fields:**
- Name
- Language preference (English, Hindi, Spanish)
- Theme preference (Light, Dark)
- Accent color (Saffron, Blue, Green, Purple)

**Components:**
- Profile display cards
- Edit button
- Form with all settings
- Save/Cancel buttons

**Workflow:**
1. Click "Edit Profile" button
2. Modify fields
3. Click Save
4. Changes update in database
5. Success message displays

**Webhook Actions Used:**
- `user.profile` - Get user profile
- `user.update` - Update profile settings

---

## 🔄 Complete User Flows

### Student Flow
```
1. Login (login-mcp)
2. View Dashboard (dashboard-mcp)
   - See enrolled courses
3. Browse Courses (courses-mcp)
4. Edit Profile (profile-mcp)
```

### Teacher Flow
```
1. Login (login-mcp)
2. View Dashboard (dashboard-mcp)
   - See courses and stats
3. Manage Courses (courses-mcp)
   - Create new course
   - View enrollments
4. Mark Attendance (attendance-mcp)
   - Select lesson
   - Record attendance
5. View Earnings (earnings-mcp)
   - Track payments
6. Edit Profile (profile-mcp)
```

### Partner Flow
```
1. Login (login-mcp)
2. View Dashboard (dashboard-mcp)
   - See services overview
3. Manage Services (services-mcp)
   - Create services
   - View bookings
   - Track status
4. Edit Profile (profile-mcp)
```

### Admin Flow
```
1. Login (login-mcp)
2. View Dashboard (dashboard-mcp)
   - System statistics
3. Browse Courses (courses-mcp)
4. View all users (indirectly through other screens)
```

---

## 🎯 Key Features

### Authentication
- Email-based login
- No password required (for testing)
- Session persistence
- Quick test credentials

### Role-Based Access
- SuperAdmin/Admin: Full system view
- Teacher: Course, attendance, earnings management
- Student: Course browsing, enrollment
- Partner: Service and booking management
- Others: Basic profile and info

### Responsive Design
- Mobile-friendly layouts
- Grid system for courses/services
- Sidebar navigation
- Modal dialogs

### Data Handling
- All data via webhook API
- SQLite backend
- Real-time updates
- Error handling

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with SuperAdmin
- [ ] Login with Teacher
- [ ] Login with Student
- [ ] Login with Partner
- [ ] Session persists after refresh
- [ ] Cannot access protected routes without login

### Dashboard
- [ ] SuperAdmin sees statistics
- [ ] Teacher sees courses
- [ ] Student sees enrollments
- [ ] Partner sees services
- [ ] Correct data displays

### Courses
- [ ] View all courses
- [ ] Teacher can create course
- [ ] Non-teacher cannot create
- [ ] Course modal displays
- [ ] Form validation works

### Attendance
- [ ] Only teacher can access
- [ ] Lesson selector works
- [ ] Present/Absent buttons work
- [ ] Status updates in real-time
- [ ] Student list displays

### Earnings
- [ ] Only teacher can access
- [ ] Total earnings displays
- [ ] Monthly history shows
- [ ] Amounts are formatted
- [ ] Dates are correct

### Services
- [ ] Only partner can access
- [ ] Create service works
- [ ] Services grid displays
- [ ] Bookings table shows
- [ ] Status badges work

### Profile
- [ ] View profile displays
- [ ] Edit mode activates
- [ ] Save updates database
- [ ] Settings persist
- [ ] Error messages show

---

## 💾 Database Schema

All screens use the following database structure:

```sql
Users (id, role, name, email, language_pref, theme_pref, accent_color)
Courses (id, title, description, teacher_id)
Lessons (id, course_id, title, content, scheduled_date)
Enrollments (id, student_id, course_id, enrolled_date)
Attendance (id, teacher_id, student_id, lesson_id, date, status)
Earnings (id, teacher_id, amount, date, description)
Services (id, partner_id, name, description, price)
Bookings (id, partner_id, customer_name, service_id, date, status)
VectorData (id, entity_type, entity_id, embedding_type, vector, metadata)
```

---

## 🚀 Next Steps

1. **Test all screens** with different user roles
2. **Connect to n8n** using webhook endpoint
3. **Configure PostgreSQL** for production
4. **Add vector embeddings** for search
5. **Implement authentication** with JWT tokens
6. **Add more screens** based on requirements

---

**Last Updated:** April 28, 2026  
**Status:** All Screens Ready for Testing ✅
