/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import { Plus, Pencil, Trash2, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Edit mode track karne ke liye
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '', category: '', sku: '' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Modal kholne ka function (Add ya Edit dono ke liye)
  const openModal = (product = null) => {
    if (product) {
      setEditId(product._id);
      setFormData({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        sku: product.sku
      });
    } else {
      setEditId(null);
      setFormData({ name: '', price: '', quantity: '', category: '', sku: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // UPDATE API call
        await API.put(`/products/${editId}`, formData);
        toast.success("Product updated successfully!");
      } else {
        // CREATE API call
        await API.post('/products', formData);
        toast.success("Product added successfully!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-sm text-gray-500">Manage your store products and stock levels</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-semibold">Rs. {product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => openModal(product)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Pencil size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Same for Add and Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Product Name" required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Price" required
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <input 
                  type="number" placeholder="Quantity" required
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <input 
                type="text" placeholder="Category" required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
              <input 
                type="text" placeholder="PROD-123" required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">
                {editId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;