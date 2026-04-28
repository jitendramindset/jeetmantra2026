import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Earn from './pages/Earn';
import Partner from './pages/Partner';
import BecomeTeacher from './pages/BecomeTeacher';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import LoginWebhook from './pages/LoginWebhook';
import DashboardWebhook from './pages/DashboardWebhook';
import CoursesScreen from './pages/CoursesScreen';
import AttendanceScreen from './pages/AttendanceScreen';
import EarningsScreen from './pages/EarningsScreen';
import ServicesScreen from './pages/ServicesScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('jeetmantra_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('jeetmantra_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('jeetmantra_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jeetmantra_user');
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Webhook/MCP-based routes (new system) */}
        <Route path="/login-mcp" element={<LoginWebhook />} />
        <Route path="/dashboard-mcp" element={user ? <DashboardWebhook /> : <Navigate to="/login-mcp" />} />
        <Route path="/courses-mcp" element={user ? <CoursesScreen /> : <Navigate to="/login-mcp" />} />
        <Route path="/attendance-mcp" element={user ? <AttendanceScreen /> : <Navigate to="/login-mcp" />} />
        <Route path="/earnings-mcp" element={user ? <EarningsScreen /> : <Navigate to="/login-mcp" />} />
        <Route path="/services-mcp" element={user ? <ServicesScreen /> : <Navigate to="/login-mcp" />} />
        <Route path="/profile-mcp" element={user ? <ProfileScreen /> : <Navigate to="/login-mcp" />} />
        
        {/* Original routes */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/become-teacher" element={<BecomeTeacher />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
