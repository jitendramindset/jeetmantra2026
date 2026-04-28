# JeetMantra MCP API Guidance

## Overview
This document maps each frontend screen to its corresponding MCP webhook actions and provides example payload formats for implementation.

## Screen-to-Action Mapping

### 1. Login Screen (`/login-mcp`)
**Webhook Action**: `auth.login`
**Payload Format**:
```json
{
  "action": "auth.login",
  "identity": "login",
  "userId": 1,
  "role": "string",
  "data": {
    "email": "string",
    "password": "string"
  }
}
```

### 2. Dashboard Screen (`/dashboard-mcp`)
**Webhook Action**: `dashboard.fetch`
**Payload Format**:
```json
{
  "action": "dashboard.fetch",
  "identity": "dashboard",
  "userId": 1,
  "role": "string",
  "data": {}
}
```

### 3. Courses Screen (`/courses-mcp`)
**Webhook Actions**:
- `course.list` - Get all courses
- `course.create` - Create new course
- `course.update` - Update course

**Payload Formats**:
```json
// course.list
{
  "action": "course.list",
  "identity": "course.list",
  "userId": 1,
  "role": "string",
  "data": {}
}

// course.create
{
  "action": "course.create",
  "identity": "course.create",
  "userId": 1,
  "role": "string",
  "data": {
    "title": "string",
    "description": "string",
    "price": "number"
  }
}

// course.update
{
  "action": "course.update",
  "identity": "course.update",
  "userId": 1,
  "role": "string",
  "data": {
    "courseId": "number",
    "title": "string",
    "description": "string",
    "price": "number"
  }
}
```

### 4. Attendance Screen (`/attendance-mcp`)
**Webhook Actions**:
- `attendance.list` - Get attendance records
- `attendance.record` - Record attendance

**Payload Formats**:
```json
// attendance.list
{
  "action": "attendance.list",
  "identity": "attendance.list",
  "userId": 1,
  "role": "string",
  "data": {}
}

// attendance.record
{
  "action": "attendance.record",
  "identity": "attendance.record",
  "userId": 1,
  "role": "string",
  "data": {
    "lessonId": "number",
    "studentId": "number",
    "status": "present|absent"
  }
}
```

### 5. Earnings Screen (`/earnings-mcp`)
**Webhook Action**: `earnings.fetch`
**Payload Format**:
```json
{
  "action": "earnings.fetch",
  "identity": "earnings",
  "userId": 1,
  "role": "string",
  "data": {}
}
```

### 6. Services Screen (`/services-mcp`)
**Webhook Actions**:
- `service.list` - Get partner services
- `service.create` - Create new service
- `booking.list` - Get bookings
- `booking.create` - Create booking

**Payload Formats**:
```json
// service.list
{
  "action": "service.list",
  "identity": "service.list",
  "userId": 1,
  "role": "string",
  "data": {}
}

// service.create
{
  "action": "service.create",
  "identity": "service.create",
  "userId": 1,
  "role": "string",
  "data": {
    "name": "string",
    "description": "string",
    "price": "number"
  }
}

// booking.list
{
  "action": "booking.list",
  "identity": "booking.list",
  "userId": 1,
  "role": "string",
  "data": {}
}

// booking.create
{
  "action": "booking.create",
  "identity": "booking.create",
  "userId": 1,
  "role": "string",
  "data": {
    "serviceId": "number",
    "customerName": "string",
    "bookingDate": "string"
  }
}
```

### 7. Profile Screen (`/profile-mcp`)
**Webhook Actions**:
- `user.profile` - Get user profile
- `user.update` - Update user profile

**Payload Formats**:
```json
// user.profile
{
  "action": "user.profile",
  "identity": "user.profile",
  "userId": 1,
  "role": "string",
  "data": {}
}

// user.update
{
  "action": "user.update",
  "identity": "user.update",
  "userId": 1,
  "role": "string",
  "data": {
    "name": "string",
    "language": "string",
    "theme": "string",
    "accentColor": "string"
  }
}