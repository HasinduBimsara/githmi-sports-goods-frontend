import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import ImageUploader from "../../components/admin/ImageUploader";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    price: "",
    labeledPrice: "",
    stock: "",
    category: "General",
    description: "",
    images: "",
    isBestDeal: false,
    isLatest: false,
    isReadyToShip: false,
  });

  const fetchProducts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/product`);
      // Adapt based on actual API response
      const data = Array.isArray(response.data) ? response.data : response.data.products || [];
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productId: product.productId || "",
        name: product.name || "",
        price: product.price || "",
        labeledPrice: product.labeledPrice || "",
        stock: product.stock || "",
        category: product.category || "General",
        description: product.description || "",
        images: product.images || [],
        isBestDeal: product.isBestDeal || false,
        isLatest: product.isLatest || false,
        isReadyToShip: product.isReadyToShip || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productId: "",
        name: "",
        price: "",
        labeledPrice: "",
        stock: "",
        category: "General",
        description: "",
        images: [],
        isBestDeal: false,
        isLatest: false,
        isReadyToShip: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      if (value.trim().length > 2) {
        const suggested = suggestCategory(value);
        setFormData((prev) => ({ ...prev, category: suggested }));
      } else {
        setFormData((prev) => ({ ...prev, category: "General" }));
      }
    }
  };

  const suggestCategory = (productName) => {
    const categories = {
      "Footwear": ["shoe", "sneaker", "boot", "cleat", "running", "zoom", "pegasus", "spikes"],
      "Football": ["football", "soccer", "shin guard", "messi", "ronaldo", "fifa"],
      "Cricket": ["cricket", "bat", "pad", "helmet", "stump", "sg", "mrf", "kookaburra", "ball"],
      "Basketball": ["basketball", "hoop", "jordan", "lebron", "lakers", "nba"],
      "Racket Sports": ["tennis", "badminton", "racket", "shuttlecock", "squash", "yonex", "wilson"],
      "Gym & Fitness": ["dumbbell", "weight", "gym", "yoga", "mat", "fitness", "treadmill", "plate"],
      "Swimming": ["swim", "goggle", "cap", "speedo", "pool", "fins"],
      "Apparel": ["jersey", "short", "shirt", "socks", "tracksuit", "jacket", "glove", "cap", "hat", "t-shirt"],
      "Indoor Games": ["carrom", "board", "chess", "dart", "billiard", "snooker", "table tennis", "ping pong"]
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, "i").test(productName))) {
        return category;
      }
    }
    return "General";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const payload = {
      ...formData,
      price: Number(formData.price),
      labeledPrice: Number(formData.labeledPrice),
      stock: Number(formData.stock),
      images: formData.images,
    };

    try {
      if (editingProduct) {
        await axios.put(`${baseUrl}/api/product/${editingProduct.productId}`, payload, config);
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${baseUrl}/api/product`, payload, config);
        toast.success("Product created successfully");
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      
      await axios.delete(`${baseUrl}/api/product/${productId}`, config);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Products Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Product ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id || product.productId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">No IMG</div>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-200">{product.productId}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{product.name}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">${product.price}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product ID</label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Labeled Price</label>
                  <input
                    type="number"
                    name="labeledPrice"
                    value={formData.labeledPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">✨ AI Enabled</span>
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Images</label>
                <ImageUploader
                  images={formData.images}
                  onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                  Homepage Display Sections
                </label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBestDeal"
                      checked={formData.isBestDeal}
                      onChange={(e) => setFormData({ ...formData, isBestDeal: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Best Deals</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isLatest"
                      checked={formData.isLatest}
                      onChange={(e) => setFormData({ ...formData, isLatest: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Latest Products</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isReadyToShip"
                      checked={formData.isReadyToShip}
                      onChange={(e) => setFormData({ ...formData, isReadyToShip: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Ready To Ship</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
