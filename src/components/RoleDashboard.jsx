import { useEffect, useState } from 'react';
import { fetchDashboard } from '../lib/api';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import PartnerDashboard from './dashboards/PartnerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import InstituteDashboard from './dashboards/InstituteDashboard';
import BranchDashboard from './dashboards/BranchDashboard';
import SchoolDashboard from './dashboards/SchoolDashboard';

function RoleDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchDashboard(user.id, user.role)
      .then((data) => setDashboardData(data))
      .catch((err) => setError(err.message || 'Unable to fetch dashboard'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <p>Please login to see your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} data={dashboardData} />;
      case 'teacher':
        return <TeacherDashboard user={user} data={dashboardData} />;
      case 'partner':
        return <PartnerDashboard user={user} data={dashboardData} />;
      case 'admin':
        return <AdminDashboard user={user} data={dashboardData} />;
      case 'superadmin':
        return <SuperAdminDashboard user={user} data={dashboardData} />;
      case 'institute':
        return <InstituteDashboard user={user} data={dashboardData} />;
      case 'branch':
        return <BranchDashboard user={user} data={dashboardData} />;
      case 'school':
        return <SchoolDashboard user={user} data={dashboardData} />;
      default:
        return <div className="card"><p>Dashboard for role "{user.role}" not implemented yet.</p></div>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
}

export default RoleDashboard;
