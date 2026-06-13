import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/signup', formData);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Full Name" required
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email" placeholder="Email" required
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <select 
            className="w-full px-3 py-2 border rounded-md"
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit" disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;