import { useState } from 'react';
import { Calendar, FileText, Send, Sparkles, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../services/api';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    fromDate: '',
    toDate: '',
    reason: '',
    documentName: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Formal');

  const handleAIGenerate = async () => {
    if (!aiPrompt) {
      toast.warning('Please enter a short reason to generate from.');
      return;
    }
    
    setAiLoading(true);
    try {
      const response = await api.post('/ai/generate', { prompt: aiPrompt, tone: aiTone });
      setFormData({ ...formData, reason: response.data.reason });
      toast.success('AI reason generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate AI reason. Please check API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/leave/apply', formData);
      toast.success('Leave request submitted successfully!');
      setFormData({ type: 'Sick Leave', fromDate: '', toDate: '', reason: '', documentName: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
    >
      <div className="mb-8 text-center">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Leave</h2>
        <p className="text-gray-500 dark:text-gray-400">Fill out the form below to request time off</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leave Type</label>
          <select 
            required
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Annual Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Date</label>
            <input 
              type="date" 
              required
              value={formData.fromDate}
              onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Date</label>
            <input 
              type="date" 
              required
              value={formData.toDate}
              onChange={(e) => setFormData({...formData, toDate: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 border border-indigo-100 dark:border-indigo-900/30 rounded-xl mb-4">
          <label className="block text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Reason Assistant
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., fever for 2 days"
              className="flex-1 px-4 py-2 text-sm rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select 
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Formal</option>
              <option>Informal</option>
              <option>Urgent</option>
            </select>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {aiLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Final Reason</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <textarea 
              required
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Leave specifics will populate here..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proof Document (Optional)</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 tracking-wide border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-indigo-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-indigo-400 dark:text-gray-400" />
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG or DOCX (MAX. 5MB)</p>
                {formData.documentName && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">Selected: {formData.documentName}</p>}
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFormData({...formData, documentName: e.target.files[0]?.name || ''})}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Submitting...' : 'Submit Request'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LeaveForm;
