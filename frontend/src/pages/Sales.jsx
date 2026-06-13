/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import { ShoppingCart, ListChecks, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ productId: "", quantity: 1 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recentSales, setRecentSales] = useState([]);

  // 1. Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        toast.error("Could not load products");
      }
    };
    fetchProducts();
  }, []);

  // 2. Handle dropdown change to show stock info
  const handleProductChange = (e) => {
    const id = e.target.value;
    const prod = products.find((p) => p._id === id);
    setSelectedProduct(prod);
    setFormData({ ...formData, productId: id });
  };
  const fetchRecentSales = async () => {
    try {
      const { data } = await API.get("/sales");
      // Data ko pehle reverse karein takay latest sales top par ayen, phir slice karein
      const latestSales = [...data].reverse().slice(0, 5);
      setRecentSales(latestSales);
    } catch (error) {
      console.error("Recent sales load nahi ho saki");
    }
  };
  useEffect(() => {
    fetchRecentSales();
  }, []);

  // 3. Submit Sale
  const handleSale = async (e) => {
    e.preventDefault();
    if (!formData.productId) return toast.error("Please select a product");

    setLoading(true);
    try {
      const { data } = await API.post("/sales", formData);
      toast.success(`Sale Successful! Total: Rs. ${data.sale.totalPrice}`);
      fetchRecentSales();
      // Reset form and update local products state (stock update)
      setFormData({ productId: "", quantity: 1 });
      setSelectedProduct(null);

      // Refresh products list to show updated stock
      const updatedProds = await API.get("/products");
      setProducts(updatedProds.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sale failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <ShoppingCart className="text-blue-600" /> Point of Sale (POS)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sale Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">New Transaction</h2>
            <form onSubmit={handleSale} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.productId}
                  onChange={handleProductChange}
                >
                  <option value="">-- Search Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} - (Rs. {p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>

              {selectedProduct && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-600">Available Stock:</span>
                    <span className="font-bold text-blue-800">
                      {selectedProduct.quantity} units
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-blue-200 mt-2 pt-2">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-blue-700">
                      Rs. {selectedProduct.price * formData.quantity}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    Complete Sale <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tips/Info Section */}
          <div className="space-y-6">
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl min-h-100">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-gray-700 pb-3">
                <ListChecks className="text-green-400" /> Recent Activity
              </h3>

              <div className="space-y-4">
                {recentSales.length > 0 ? (
                  recentSales.map((sale) => (
                    <div
                      key={sale._id}
                      className="bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm text-gray-200">
                          {sale.product?.name || "Product"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(sale.createdAt).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}{" "}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          Qty: {sale.quantity}
                        </span>
                        <span className="text-sm font-bold text-green-400">
                          Rs. {sale.totalPrice}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No recent transactions
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sales;
