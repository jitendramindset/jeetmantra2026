# Screen Alignment Mapping

This document maps each extracted Doc1 screenshot to the corresponding frontend screen and identifies required UI adjustments to ensure exact visual alignment.

## Image-to-Screen Mapping

| Image | Screen | Role (if applicable) | Alignment Notes |
|-------|--------|----------------------|-----------------|
| image1.png | Login Screen | All Roles | Match logo placement, button styling, and credential fields exactly |
| image2.png | Dashboard (SuperAdmin) | SuperAdmin | Replicate card layout, statistics display, and action button positions |
| image3.png | Dashboard (Teacher) | Teacher | Adjust cards to show earnings, attendance, and course stats as shown |
| image4.png | Dashboard (Partner) | Partner | Update cards to reflect service bookings and revenue metrics |
| image5.png | Courses Screen | Teacher | Match course grid layout, card design, and create-course modal |
| image6.png | Attendance Screen | Teacher | Replicate lesson selector sidebar and attendance table styling |
| image7.png | Earnings Screen | Teacher | Align earnings summary cards and transaction table format |
| image8.png | Services Screen | Partner | Adjust service cards, create-service form, and bookings table |
| image9.png | Profile Screen | All Roles | Match profile display layout, edit form fields, and theme settings |
| image10.png | Partner Dashboard | Partner | Update dashboard cards to reflect partner-specific metrics |
| image11.png | Admin Dashboard | Admin | Align admin-specific statistics and management controls |
| image12.png | Branch Dashboard | Branch | Update to show branch-level data and related actions |
| image13.png | Institute Dashboard | Institute | Match institute-specific metrics and management UI |
| image14.png | SuperAdmin Dashboard | SuperAdmin | Replicate high-level overview with all role statistics |
| ... | ... | ... | ... (additional images map to role-specific variations of existing screens) |

## Required UI Adjustments

1. **Login Screen** (`LoginWebhook.jsx`)
   - Update button styling to match image1.png
   - Ensure logo placement and field dimensions align exactly
   - Verify automatic role detection matches screenshot

2. **Dashboard Screen** (`Dashboard.jsx` & `DashboardWebhook.jsx`)
   - Adjust card component layout based on role-specific images
   - Update statistics display (user counts, bookings, etc.)
   - Match action button colors and positions

3. **Courses Screen** (`CoursesScreen.jsx`)
   - Replicate course card grid and hover effects
   - Update modal design for course creation
   - Ensure course title, description, and price fields match screenshot

4. **Attendance Screen** (`AttendanceScreen.jsx`)
   - Update lesson selector sidebar styling
   - Adjust attendance table layout and status badge colors
   - Match present/absent button appearance

5. **Earnings Screen** (`EarningsScreen.jsx`)
   - Align summary cards with financial metrics display
   - Update transaction table format and currency formatting
   - Match date sorting and amount highlighting

6. **Services Screen** (`ServicesScreen.jsx`)
   - Update service card design and pricing display
   - Adjust create-service modal layout
   - Replicate bookings table styling and status badges

7. **Profile Screen** (`ProfileScreen.jsx`)
   - Update profile display card layout
   - Adjust edit form field styling and validation
   - Match theme and accent color selection components

## Default Data Alignment

All default seeded data (users, courses, earnings, services) must match the example values shown in the corresponding screenshots. Review `seed-sqlite.js` and `seed-data.js` to ensure:
- Test credentials match the email/password combinations in the login screenshot
- Default statistics (e.g., student counts, course numbers) reflect the values displayed in each dashboard variation
- Currency formatting matches the monetary values shown in earnings and services screens

## API Payload Verification

Each screen must trigger the exact webhook action shown in the corresponding screenshot's data layer:
- Verify `auth.login` payload structure matches login screen interaction
- Confirm `dashboard.fetch` returns data format matching dashboard screenshot
- Ensure `course.list`, `attendance.record`, and other actions produce responses that render correctly

The mappings above should be used to guide visual adjustments and ensure complete fidelity to the documented designs.