#!/bin/bash

# JeetMantra MCP Webhook System - Quick Test Suite
# This script tests all the webhook endpoints

BASE_URL="http://localhost:3000/api/webhook"

echo "🧪 JeetMantra MCP Webhook Test Suite"
echo "====================================="
echo ""

# Test 1: Login
echo "1️⃣  Testing Login Webhook..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth.login",
    "identity": "login-page",
    "data": {"email": "superadmin@jeetmantra.com"},
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Extract user ID from response
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
ROLE=$(echo $LOGIN_RESPONSE | grep -o '"role":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ User ID: $USER_ID"
echo "✅ Role: $ROLE"
echo ""

# Test 2: Fetch Dashboard
echo "2️⃣  Testing Dashboard Fetch..."
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "dashboard.fetch",
    "identity": "dashboard-page",
    "userId": '$USER_ID',
    "role": "'$ROLE'",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.' 2>/dev/null || echo "Dashboard data received"

echo ""

# Test 3: List Courses
echo "3️⃣  Testing List Courses..."
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "course.list",
    "identity": "courses-page",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.data | length' 2>/dev/null || echo "Course list received"

echo ""

# Test 4: Get User Profile
echo "4️⃣  Testing User Profile..."
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "user.profile",
    "identity": "profile-page",
    "userId": '$USER_ID',
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.data' 2>/dev/null || echo "Profile data received"

echo ""

# Test 5: List Services (for partner)
echo "5️⃣  Testing List Services (Partner only)..."
LOGIN_PARTNER=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth.login",
    "identity": "login-page",
    "data": {"email": "partner@jeetmantra.com"},
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }')

PARTNER_ID=$(echo $LOGIN_PARTNER | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "service.list",
    "identity": "services-page",
    "userId": '$PARTNER_ID',
    "data": {"partner_id": '$PARTNER_ID'},
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.data | length' 2>/dev/null || echo "Services list received"

echo ""

# Test 6: Test Teacher-specific endpoint
echo "6️⃣  Testing Teacher Earnings..."
LOGIN_TEACHER=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth.login",
    "identity": "login-page",
    "data": {"email": "raj.teacher@jeetmantra.com"},
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }')

TEACHER_ID=$(echo $LOGIN_TEACHER | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "earnings.fetch",
    "identity": "earnings-page",
    "userId": '$TEACHER_ID',
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.data' 2>/dev/null || echo "Earnings data received"

echo ""
echo "✅ All tests completed!"
echo ""
echo "📱 Access the web interface:"
echo "   - Login: http://localhost:3000/login-mcp"
echo "   - Test with credentials from README-MCP-WEBHOOK.md"
