import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './AdminPage.css';
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const AdminProductManagement = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageFile: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('${API_BASE_URL}/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('Image file selected:', file ? file.name : 'No file');
    setNewProduct({ ...newProduct, imageFile: file });
  };

  const handleAddProduct = async (e) => {
    console.log('🔥 handleAddProduct CALLED!');
    e.preventDefault();
    console.log('✅ preventDefault() executed');
    
    console.log('Add Product clicked - Current state:', newProduct);

    if (!newProduct.name || !newProduct.price || !newProduct.stockQuantity || !newProduct.category) {
      alert('Please fill in all required fields (Name, Category, Price, Stock Quantity)');
      console.log('Validation failed: Missing required fields');
      return;
    }

    if (!newProduct.imageFile) {
      alert('Please select an image for the product');
      console.log('Validation failed: No image file selected');
      return;
    }
    
    console.log('All validations passed, proceeding with product addition...');

    try {
      // First, upload the image
      const formData = new FormData();
      formData.append('file', newProduct.imageFile);

      const uploadResponse = await axios.post('${API_BASE_URL}/api/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = uploadResponse.data.imageUrl;

      // Get or create the category
      let categoryId;
      try {
        // Try to get category by name
        const catResponse = await axios.get(`${API_BASE_URL}/categories/name/${encodeURIComponent(newProduct.category)}`);
        categoryId = catResponse.data.id;
      } catch (error) {
        // Category doesn't exist, create it
        const newCat = await axios.post('${API_BASE_URL}/categories', {
          name: newProduct.category,
          description: newProduct.category
        });
        categoryId = newCat.data.id;
      }

      // Create the product with the uploaded image URL
      const productData = {
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        category: { id: categoryId },
        imageUrl: imageUrl,
        isActive: true
      };

      await axios.post('${API_BASE_URL}/products', productData);
      
      alert('Successfully added product');
      
      // Reset the file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setShowAddForm(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        imageFile: null
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-container">
          <h2>Product Management</h2>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="shop-header">
        <div className="shop-header-content">
          <div className="shop-header-inner">
            {/* Left: Back Button */}
            <button 
              onClick={() => navigate('/admin')} 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ display: 'block' }} />
              <span className="font-semibold text-sm" style={{ lineHeight: '1', display: 'block' }}>Back</span>
            </button>

            {/* Right: Logo Section */}
            <div className="shop-logo-section">
              <div className="shop-logo">
                <div className="shop-logo-main">Kodikara</div>
                <div className="shop-logo-sub">ENTERPRISES</div>
              </div>
              <div className="shop-tagline">Premium Bathware Solutions</div>
            </div>
          </div>
        </div>
      </header>

      <div className="page-container">
        <h2>Product Management</h2>
        <p className="subtitle">Manage your product catalog</p>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? '#dc2626' : '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Product'}
        </button>
        <button 
          onClick={fetchProducts}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Refresh
        </button>
      </div>

      {showAddForm && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '2px solid #2563eb'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2563eb' }}>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., CC Delux Water Closet"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Water Closets">Water Closets</option>
                  <option value="Basins">Basins</option>
                  <option value="Bathroom Sets">Bathroom Sets</option>
                  <option value="Other Products">Other Products</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="45000"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={newProduct.stockQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="50"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Premium water closet with modern design..."
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Product Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Select an image file (PNG, JPG, etc.)
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="submit"
                onClick={() => console.log('🔘 Submit button clicked!')}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Add Product
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Product List ({products.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Stock</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>{product.id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '1rem' }}>{product.category?.name || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>Rs. {product.price}</td>
                    <td style={{ padding: '1rem' }}>{product.stockQuantity}</td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#25378C] to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col mb-4">
              <div className="text-2xl font-bold text-white tracking-wide">
                Kodikara
              </div>
              <div className="text-xs font-semibold text-blue-200 tracking-[0.2em] -mt-1">
                ENTERPRISES
              </div>
            </div>
            <p className="text-blue-200 mb-8">Your trusted partner for premium bathware solutions and exceptional quality products.</p>
            <div className="border-t border-blue-600 pt-8 text-blue-200">
              <p>&copy; 2025 Kodikara Enterprises. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminProductManagement;

