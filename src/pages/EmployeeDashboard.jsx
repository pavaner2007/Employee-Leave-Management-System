import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';
import api from '../services/api';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({ total: 20, used: 0, pending: 0, available: 20 });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, balanceRes] = await Promise.all([
          api.get('/leave/all'),
          api.get('/auth/me'),
        ]);
        const leaves = leavesRes.data;
        const balance = balanceRes.data?.leaveBalance ?? 20;
        const used = leaves.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0);
        const pending = leaves.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.days, 0);
        setStats({ total: balance + used, used, pending, available: balance });
        setRecentLeaves(leaves.slice(0, 5));
      } catch (_err) {
        setRecentLeaves([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: 'Used', value: stats.used || 0, color: '#4f46e5' },
    { name: 'Pending', value: stats.pending || 0, color: '#eab308' },
    { name: 'Available', value: stats.available || 0, color: '#22c55e' },
  ];

  const statCards = [
    { title: 'Total Leaves', value: stats.total, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Available', value: stats.available, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'Used', value: stats.used, icon: XCircle, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <Link to="/employee/apply" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200">
          Apply Leave
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-1"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Leave Balance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {data.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Leaves</h2>
            <Link to="/employee/leaves" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="py-4 px-6 font-medium">Leave Type</th>
                  <th className="py-4 px-6 font-medium">Duration</th>
                  <th className="py-4 px-6 font-medium">Days</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : recentLeaves.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">No leaves found. Apply for your first leave!</td></tr>
                ) : recentLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200 font-medium">{leave.type}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{leave.fromDate} to {leave.toDate}</td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-200">{leave.days}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${leave.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${leave.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
