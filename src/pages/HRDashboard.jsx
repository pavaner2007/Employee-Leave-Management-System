import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, FileCheck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const HRDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      try {
        const res = await api.get('/leave/all');
        setLeaves(res.data);
      } catch (_err) {
        toast.error('Failed to fetch leave data');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/leave/${id}`, { status });
      toast.success(`Leave ${status} successfully`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const total = leaves.length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const pending = leaves.filter(l => l.status === 'pending').length;
  const managerApproved = leaves.filter(l => l.status === 'manager_approved').length;
  const rejected = leaves.filter(l => l.status === 'rejected').length;

  const statCards = [
    { title: 'Total Requests', value: total, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'Approved', value: approved, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Awaiting HR', value: managerApproved, icon: FileCheck, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Rejected', value: rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  ];

  // Group by leave type for chart
  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Unpaid Leave'];
  const chartData = leaveTypes.map(type => ({
    name: type.replace(' Leave', ''),
    approved: leaves.filter(l => l.type === type && l.status === 'approved').length,
    pending: leaves.filter(l => l.type === type && l.status === 'pending').length,
    rejected: leaves.filter(l => l.type === type && l.status === 'rejected').length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Company-wide leave analytics and management</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Leave Type Analytics</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Leave Requests <span className="text-sm font-normal text-gray-400">(Manager-approved awaiting HR)</span></h2>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0">
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="py-4 px-6 font-medium">Employee</th>
                  <th className="py-4 px-6 font-medium">Type</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : leaves.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">No leave requests yet.</td></tr>
                ) : leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <td className="py-3 px-6 text-sm text-gray-900 dark:text-gray-200">{leave.employee?.name || 'Unknown'}</td>
                    <td className="py-3 px-6 text-sm text-gray-500 dark:text-gray-400">{leave.type}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${leave.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${leave.status === 'manager_approved' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${leave.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>{leave.status === 'manager_approved' ? 'Awaiting HR' : leave.status}</span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {leave.status === 'manager_approved' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction(leave._id, 'approved')} className="px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 rounded text-xs font-medium transition-colors">Approve</button>
                          <button onClick={() => handleAction(leave._id, 'rejected')} className="px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 rounded text-xs font-medium transition-colors">Reject</button>
                        </div>
                      )}
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

export default HRDashboard;
