import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, FileText, Settings, LogOut, CheckSquare } from 'lucide-react';

const Sidebar = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();

  const getNavItems = () => {
    const common = [
      { name: 'Dashboard', icon: Home, path: `/${role}` },
    ];

    if (role === 'employee') {
      return [
        ...common,
        { name: 'My Leaves', icon: Calendar, path: '/employee/leaves' },
        { name: 'Apply Leave', icon: FileText, path: '/employee/apply' },
      ];
    } else if (role === 'manager') {
      return [
        ...common,
        { name: 'Leave Requests', icon: CheckSquare, path: '/manager/requests' },
        { name: 'Team Calendar', icon: Calendar, path: '/manager/calendar' },
      ];
    } else if (role === 'hr') {
      return [
        ...common,
        { name: 'All Requests', icon: FileText, path: '/hr/requests' },
        { name: 'Employees', icon: Users, path: '/hr/employees' },
        { name: 'Verify Documents', icon: CheckSquare, path: '/hr/verify' },
      ];
    }
    return common;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div className={`fixed md:sticky top-0 z-50 md:z-auto flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          LeaveFlow
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <NavLink 
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
