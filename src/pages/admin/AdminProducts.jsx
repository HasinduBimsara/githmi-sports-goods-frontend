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
    colors: [],
    sizes: [],
  });

  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newSizePrice, setNewSizePrice] = useState("");
  const [newSizeLabeledPrice, setNewSizeLabeledPrice] = useState("");
  const [newSizeColor, setNewSizeColor] = useState("");
  const [newSizeStock, setNewSizeStock] = useState("");

  const fetchProducts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/product`);
      // Adapt based on actual API response
      const data = Array.isArray(response.data) ? response.data : response.data.products || [];
      setProducts(data);
    } catch (error) {
      console.error(error);
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
        colors: product.colors || [],
        sizes: product.sizes || [],
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
        colors: [],
        sizes: [],
      });
    }
    setNewColor("");
    setNewSize("");
    setNewSizePrice("");
    setNewSizeLabeledPrice("");
    setNewSizeColor("");
    setNewSizeStock("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: inputValue }));

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

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      const addedColor = newColor.trim();
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, addedColor] }));
      setNewColor("");
      // Auto-select the first color in the matrix dropdown
      if (!newSizeColor) setNewSizeColor(addedColor);
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== colorToRemove) }));
  };

  const handleAddSize = () => {
    // Implicit Fallbacks: Grab globally declared pricing values if the seller refrains from mapping specific dimensions
    const finalPrice = newSizePrice.trim() !== "" ? Number(newSizePrice) : Number(formData.price || 0);
    const finalLabeled = newSizeLabeledPrice.trim() !== "" ? Number(newSizeLabeledPrice) : (finalPrice || Number(formData.labeledPrice || 0));
    
    // Pass size "Any" inherently if omitted to satisfy the Mongoose backend strictly checking generic bounds
    const finalSizeName = newSize.trim() || "Any";

    if (newSizeStock.trim() && finalPrice >= 0) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, { 
          color: newSizeColor,
          size: finalSizeName, 
          price: finalPrice, 
          labeledPrice: finalLabeled,
          stock: Number(newSizeStock)
        }]
      }));
      setNewSize("");
      setNewSizePrice("");
      setNewSizeLabeledPrice("");
      setNewSizeStock("");
      // Keep color dropdown on the first color after adding, not reset to empty
      if (formData.colors.length > 0 && !newSizeColor) setNewSizeColor(formData.colors[0]);
    } else {
      toast.error("Please enter a Stock value and ensure a Base Price is configured if you omit specific ones.");
    }
  };

  const handleRemoveSize = (sizeToRemove, colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => !(s.size === sizeToRemove && s.color === colorToRemove))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const priceToSubmit = formData.sizes.length > 0 ? formData.sizes[0].price : Number(formData.price);
    const labeledPriceToSubmit = formData.sizes.length > 0 ? (formData.sizes[0].labeledPrice || formData.sizes[0].price) : Number(formData.labeledPrice);
    const stockToSubmit = formData.sizes.length > 0 ? formData.sizes.reduce((total, s) => total + (Number(s.stock) || 0), 0) : Number(formData.stock);

    const payload = {
      ...formData,
      price: priceToSubmit,
      labeledPrice: labeledPriceToSubmit,
      stock: stockToSubmit,
      images: formData.images,
      colors: formData.colors,
      sizes: formData.sizes,
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
      console.error(error);
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
      console.error(error);
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
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">LKR {product.price}</td>
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
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Product ID</label>
                  <input
                    type="text"
                    name="productId"
                    placeholder="e.g. BAT-01"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Selling Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required={formData.sizes.length === 0}
                    disabled={formData.sizes.length > 0}
                    min="0"
                    className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl ${formData.sizes.length > 0 ? 'bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed' : 'bg-gray-50 dark:bg-gray-900'} text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                  />
                  {formData.sizes.length > 0 && <span className="text-[10px] text-indigo-500 font-bold block mt-1 uppercase tracking-wide">Controlled by Matrix Below</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Labeled Price</label>
                  <input
                    type="number"
                    name="labeledPrice"
                    value={formData.labeledPrice}
                    onChange={handleInputChange}
                    required={formData.sizes.length === 0}
                    disabled={formData.sizes.length > 0}
                    min="0"
                    className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl ${formData.sizes.length > 0 ? 'bg-gray-200 dark:bg-gray-800 opacity-50 cursor-not-allowed' : 'bg-gray-50 dark:bg-gray-900'} text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Total Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.sizes.length > 0 ? formData.sizes.reduce((t, s) => t + (Number(s.stock) || 0), 0) : formData.stock}
                    onChange={handleInputChange}
                    required={formData.sizes.length === 0}
                    disabled={formData.sizes.length > 0}
                    min="0"
                    className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl ${formData.sizes.length > 0 ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 opacity-70 cursor-not-allowed text-indigo-700 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-900'} font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                  />
                  {formData.sizes.length > 0 && <span className="text-[10px] text-indigo-500 font-bold block mt-1 uppercase tracking-wide">Aggregated from Size Matrix</span>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</label>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black tracking-widest uppercase bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full ring-1 ring-indigo-200 dark:ring-indigo-800/50">✨ AI Enabled</span>
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-indigo-700 dark:text-indigo-400"
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                   <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span> Product Images
                </label>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                  <ImageUploader
                    images={formData.images}
                    folderName={formData.name || formData.productId || "Uncategorized"}
                    onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Matrix SKU & Variants
                 </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                  {/* Colors Box */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1 mb-2">Available Colors</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Red"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
                      />
                      <button type="button" onClick={handleAddColor} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map(c => (
                        <span key={c} className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                          {c}
                          <button type="button" onClick={() => handleRemoveColor(c)} className="text-red-500 hover:text-red-700 ml-1.5 bg-red-50 dark:bg-red-900/30 p-0.5 rounded cursor-pointer"><FiX /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sizes Box */}
                  <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1 mb-1">Matrix Combinations</label>
                    <p className="text-[11px] text-gray-400 mb-4 pl-1">Map specific stock bounds (e.g Red Size M has 5 quantities).</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3 items-end bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      {formData.colors.length > 0 && (
                        <div className="w-1/4 min-w-[100px]">
                          <label className="block text-[9px] text-gray-400 uppercase font-bold tracking-wide mb-1">Color</label>
                          <select 
                            className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-bold outline-none"
                            value={newSizeColor}
                            onChange={(e) => setNewSizeColor(e.target.value)}
                          >
                            <option value="">Default/Any</option>
                            {formData.colors.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="flex-1 min-w-[60px]">
                        <label className="block text-[9px] text-blue-500 uppercase font-black tracking-wide mb-1">Size (Opt)</label>
                        <input
                          type="text"
                          className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-bold outline-none focus:border-blue-500 placeholder-gray-400"
                          placeholder="Any"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 min-w-[70px]">
                        <label className="block text-[9px] text-gray-400 uppercase font-bold tracking-wide mb-1">Sell (Opt)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-bold outline-none placeholder-gray-400"
                          placeholder="Auto"
                          value={newSizePrice}
                          onChange={(e) => setNewSizePrice(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 min-w-[70px]">
                        <label className="block text-[9px] text-gray-400 uppercase font-bold tracking-wide mb-1">Orig (Opt)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-bold outline-none placeholder-gray-400"
                          placeholder="Auto"
                          value={newSizeLabeledPrice}
                          onChange={(e) => setNewSizeLabeledPrice(e.target.value)}
                        />
                      </div>
                      <div className="w-16 min-w-[60px]">
                        <label className="block text-[9px] text-green-500 uppercase font-black tracking-wide mb-1">Stock</label>
                        <input
                          type="number"
                          className="w-full px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-gray-900 text-xs font-bold outline-none text-green-700 dark:text-green-500 focus:border-green-500"
                          placeholder="Qty"
                          value={newSizeStock}
                          onChange={(e) => setNewSizeStock(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                        />
                      </div>
                      <button type="button" onClick={handleAddSize} className="bg-indigo-600 h-[34px] text-white px-4 rounded-lg text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors">Add</button>
                    </div>
                    
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mt-2 pr-2">
                      {formData.sizes.map(s => (
                        <div key={`${s.size}-${s.color}`} className="flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-xs shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                          <div className="flex gap-2 items-center">
                            {s.color && (
                              <span className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-1.5 py-0.5 rounded text-[10px] font-black uppercase ring-1 ring-purple-200 dark:ring-purple-800/50">
                                {s.color}
                              </span>
                            )}
                            <span className="font-black text-gray-900 dark:text-white px-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded uppercase">{s.size}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-medium">
                              <span className="line-through">{s.labeledPrice ? `LKR ${s.labeledPrice}` : ''}</span>
                            </span>
                            <span className="text-gray-900 dark:text-white font-black">LKR {s.price}</span>
                            <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                              {s.stock} Unit{s.stock > 1 ? 's' : ''}
                            </span>
                            <button type="button" onClick={() => handleRemoveSize(s.size, s.color)} className="opacity-50 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-1 rounded transition-all"><FiX /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                 <div className="bg-indigo-50 dark:bg-gray-900/50 p-4 rounded-xl border border-indigo-100 dark:border-gray-800">
                  <label className="block text-[11px] font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-indigo-100 dark:border-gray-700 pb-2">
                    Homepage Tags
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-bold select-none group">
                      <input
                        type="checkbox"
                        name="isBestDeal"
                        checked={formData.isBestDeal}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-indigo-600 transition-colors">Best Deals</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-bold select-none group">
                      <input
                        type="checkbox"
                        name="isLatest"
                        checked={formData.isLatest}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-indigo-600 transition-colors">New Arrivals</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-bold select-none group">
                      <input
                        type="checkbox"
                        name="isReadyToShip"
                        checked={formData.isReadyToShip}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="group-hover:text-indigo-600 transition-colors">Limited Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
                  placeholder="Tell your customers about this product..."
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 -mx-6 px-6 pb-2 z-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl text-white font-black bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  {editingProduct ? "Save Changes" : "Publish Product"}
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
