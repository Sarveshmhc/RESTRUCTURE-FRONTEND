import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/login/Login';
import Profile from './views/partials/profile/Profile';
import BaseLayout from './views/partials/baselayout/BaseLayout';
import EmployeeInbox from "./views/employee/inbox/EmployeeInbox";
import HRInbox from "./views/hr/inbox/HRInbox";

// HR Pages
import HRHomepage from './views/hr/homepage/HRHomepage';

const HRDashboard = () => <HRHomepage />;
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

// Employee Pages
const EmployeeDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Welcome Employee</h1>
    <p className="text-gray-600 mt-2">Your dashboard is here.</p>
  </div>
);

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
                <Route path="inbox" element={<HRInbox />} /> {/* <-- FIXED HERE */}
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
                <Route path="home" element={<EmployeeDashboard />} />
                <Route path="profile" element={<Profile />} />
                {/* Add all other Employee routes here */}
                <Route path="inbox" element={<EmployeeInbox />} /> {/* <-- FIXED HERE */}
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