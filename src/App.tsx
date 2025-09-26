import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/login/Login';
import Profile from './views/partials/profile/Profile';
import BaseLayout from './views/partials/baselayout/BaseLayout';

// HR Pages
const HRDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Welcome HR Manager</h1>
    <p className="text-gray-600 mt-2">Hope you are having a great day.</p>
  </div>
);
const AllEmployees = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">All Employees</h1>
    <p className="text-gray-600 mt-2">Manage all employees in the system</p>
  </div>
);
const EmployeeDirectory = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Employee Directory</h1>
  </div>
);
// ...other HR and Employee page components...

// Private Route Component
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'hr' ? '/hr/home' : '/employee/home'} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* HR Routes */}
      <Route
        path="/hr/*"
        element={
          <PrivateRoute allowedRole="hr">
            <BaseLayout>
              <Routes>
                <Route path="home" element={<HRDashboard />} />
                <Route path="employees/all" element={<AllEmployees />} />
                <Route path="employees/directory" element={<EmployeeDirectory />} />
                <Route path="employee-profile" element={<Profile />} />
                {/* Add all other HR routes here */}
                <Route path="*" element={<Navigate to="/hr/home" replace />} />
              </Routes>
            </BaseLayout>
          </PrivateRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <PrivateRoute allowedRole="employee">
            <BaseLayout>
              <Routes>
                <Route path="home" element={<div>Employee Dashboard</div>} />
                <Route path="profile" element={<Profile />} />
                {/* Add all other Employee routes here */}
                <Route path="*" element={<Navigate to="/employee/home" replace />} />
              </Routes>
            </BaseLayout>
          </PrivateRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;