import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Layout from './components/Layout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import LeaveForm from './components/LeaveForm';
import Settings from './pages/Settings';
import MyLeaves from './pages/MyLeaves';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Default redirect based on current root access */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<Layout allowedRoles={['employee', 'manager', 'hr']} />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="apply" element={<LeaveForm />} />
          <Route path="leaves" element={<MyLeaves />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<Layout allowedRoles={['manager']} />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="requests" element={<ManagerDashboard />} />
          <Route path="calendar" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><h2 className="text-xl dark:text-white">Team Calendar Placeholder</h2></div>} />
        </Route>

        {/* HR Routes */}
        <Route path="/hr" element={<Layout allowedRoles={['hr']} />}>
          <Route index element={<HRDashboard />} />
          <Route path="requests" element={<HRDashboard />} />
          <Route path="employees" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><h2 className="text-xl dark:text-white">Employees List Placeholder</h2></div>} />
          <Route path="verify" element={<HRDashboard />} />
        </Route>

        {/* Settings Route */}
        <Route path="/settings" element={<Layout allowedRoles={['employee', 'manager', 'hr']} />}>
          <Route index element={<Settings />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Router>
  );
}

export default App;
