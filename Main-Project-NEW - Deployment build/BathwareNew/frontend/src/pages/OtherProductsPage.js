import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategoryPages.css';
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const OtherProductsPage = ({ onBack, onAddToCart, cartCount = 0, isAuthenticated = true }) => {
  const navigate = useNavigate();
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('${API_BASE_URL}/products');
      // Filter products by "Other Products" category - use database imageUrl as-is
      const filteredProducts = response.data.filter(
        product => product.category?.name === 'Other Products'
      );
      setOtherProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const getSortedProducts = () => {
    const sorted = [...otherProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-slate-700">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      {/* Header */}
      <header className="shop-header">
        <div className="shop-header-content">
          <div className="shop-header-inner">
            {/* Left: Back Button */}
            <button 
              onClick={goBack} 
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

      {/* Hero Section */}
      <section className="shop-hero">
        <div className="shop-hero-bg">
          <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1920&h=1080&fit=crop" alt="Modern Bathroom" />
          <div className="shop-hero-overlay"></div>
        </div>
        
        <div className="shop-hero-content">
          <h1 className="shop-hero-title">
            Other Products
            <span className="shop-hero-gradient">Quality Accessories</span>
          </h1>
          <p className="shop-hero-description">
            Tiles, accessories, and miscellaneous bathroom items. Complete your bathroom with our premium collection of accessories and fixtures.
          </p>
        </div>
        
        <div className="shop-floating shop-floating-1"></div>
        <div className="shop-floating shop-floating-2"></div>
        <div className="shop-floating shop-floating-3"></div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Sort/Filter Controls */}
          <div style={{ paddingTop: '2rem', paddingBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label htmlFor="sort-select" className="text-sm font-semibold text-slate-700">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {otherProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">No products available in this category</p>
            </div>
          ) : (
            <div className="category-products-grid">
              {getSortedProducts().map((product) => (
                <div key={product.id} className="category-product-card">
                  {/* Product Image */}
                  <div className="category-product-image-container">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="category-product-image"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="category-discount-badge">
                        {product.discountPercentage}% OFF
                      </div>
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <div className="category-low-stock-badge">
                        Only {product.stockQuantity} left
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="category-product-details">
                    <h3 className="category-product-title">
                      {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="mb-1">
                      <span className="category-product-price">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="category-product-price-old">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Rating & Stock combined */}
                    <div className="category-product-meta">
                      {product.rating > 0 && (
                        <div className="category-product-rating">
                          <Star className="text-yellow-500 fill-yellow-500 mr-0.5" />
                          <span>{product.rating}</span>
                        </div>
                      )}
                      <span className={`category-product-stock ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out'}
                      </span>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else if (product.stockQuantity > 0) {
                          addToCart(product);
                        }
                      }}
                      disabled={product.stockQuantity === 0}
                      className={`category-add-to-cart-btn ${product.stockQuantity > 0 || !isAuthenticated ? 'available' : 'unavailable'}`}
                    >
                      <ShoppingCart />
                      <span>
                        {!isAuthenticated 
                          ? 'Login to Add to Cart' 
                          : product.stockQuantity > 0 
                            ? 'Add to Cart' 
                            : 'Out of Stock'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

export default OtherProductsPage;

