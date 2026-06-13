import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../api/axios';
import { ShoppingBag, DollarSign, Package, AlertTriangle, CalendarDays, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    totalSalesValue: 0, 
    totalItemsSold: 0,
    monthlySalesValue: 0, // Naya field
    monthlyItemsSold: 0   // Naya field
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          API.get('/sales/daily-report'), // Is endpoint ko backend par update karna hoga
          API.get('/products')
        ]);
        
        setStats(salesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const lowStockItems = products.filter(p => p.quantity <= 5);

  const cards = [
    // --- TODAY'S SECTION ---
    { 
      title: "Today's Revenue", 
      value: `Rs. ${stats.totalSalesValue}`, 
      icon: <DollarSign className="text-green-600"/>, 
      bg: "bg-green-100",
      link: "/sales" 
    },
    { 
      title: "Today's Items Sold", 
      value: stats.totalItemsSold, 
      icon: <ShoppingBag className="text-blue-600"/>, 
      bg: "bg-blue-100",
      link: "/sales" 
    },
    // --- MONTHLY SECTION ---
    { 
      title: "Monthly Revenue", 
      value: `Rs. ${stats.monthlySalesValue || 0}`, 
      icon: <TrendingUp className="text-orange-600"/>, 
      bg: "bg-orange-100",
      link: "/sales" 
    },
    { 
      title: "Monthly Sales Report", 
      value: `${stats.monthlyItemsSold || 0} Items`, 
      icon: <CalendarDays className="text-indigo-600"/>, 
      bg: "bg-indigo-100",
      link: "/sales" 
    },
    // --- INVENTORY ---
    { 
      title: "Active Inventory", 
      value: lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock!` : `${products.length} Products`,
      icon: lowStockItems.length > 0 ? <AlertTriangle className="text-red-600 animate-pulse"/> : <Package className="text-purple-600"/>, 
      bg: lowStockItems.length > 0 ? "bg-red-100" : "bg-purple-100",
      link: "/products",
      isWarning: lowStockItems.length > 0 
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
            Last Updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
      
      {/* Cards Grid - 3 columns on medium screens, 2 on small */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link 
            to={card.link} 
            key={index} 
            className="p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition cursor-pointer bg-white"
          >
            <div className={`p-4 rounded-lg ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className={`text-2xl font-bold ${card.isWarning ? 'text-red-600' : 'text-gray-800'}`}>
                {card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
           <div className="flex items-center gap-3">
             <AlertTriangle className="text-red-600" />
             <h3 className="text-red-800 font-bold">Action Required: Low Stock Items</h3>
           </div>
           <p className="text-red-700 text-sm mt-1">
             {lowStockItems.map(item => item.name).join(", ")} are almost out of stock.
           </p>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;