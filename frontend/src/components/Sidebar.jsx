import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { name: 'Products', icon: <Box size={20}/>, path: '/products' },
    { name: 'Sales', icon: <ShoppingCart size={20}/>, path: '/sales' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-10 px-2 text-blue-400">Store Manager</h2>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg mb-2 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={logout}
        className="flex items-center gap-3 p-3 hover:bg-red-600 rounded-lg transition mt-auto text-red-400 hover:text-white"
      >
        <LogOut size={20}/>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;