import React, { useState, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import WaterClosetsPage from './WaterClosetsPage';
import BasinsPage from './BasinsPage';
import OtherProductsPage from './OtherProductsPage';
import BathroomSetsPage from './BathroomSetsPage';
import ProductsPage from './ProductsPage';
import CartCheckoutPage from './CartCheckoutPage';
import './ShopPages.css';

const ProductHomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Get user role from sessionStorage
  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Get current user ID from localStorage
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const username = sessionStorage.getItem('username');
        
        if (username) {
          const response = await axios.get(`${API_BASE_URL}/api/admin/users/search?name=${encodeURIComponent(username)}`);
          
          if (response.data && response.data.length > 0) {
            const user = response.data.find(u => u.username === username);
            
            if (user) {
              setUserId(user.userId);
              // Fetch cart count
              fetchCartCount(user.userId);
            }
          }
        } else {
          // Fallback to guest user ID if not logged in
          setUserId(3);
          fetchCartCount(3);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserId(3); // Fallback
        fetchCartCount(3);
      }
    };

    getCurrentUserId();
  }, []);

  // Fetch cart count from backend
  const fetchCartCount = async (uid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/checkout/cart/${uid}`);
      const totalQuantity = response.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Helper function to convert category name to page key
  const getCategoryPageKey = (categoryName) => {
    return categoryName.toLowerCase().replace(/ /g, '-');
  };

  // Helper function to get category icon
  const getCategoryIcon = (categoryName) => {
    return `/images/${categoryName} Category Icon.png`;
  };

  // Helper function to get color scheme for each category
  const getCategoryColors = (index) => {
    const colorSchemes = [
      { primary: '#2563eb', secondary: '#60a5fa', light: '#93c5fd', gradient: 'from-blue-600 to-cyan-600', hover: 'from-blue-700 to-cyan-700' },
      { primary: '#0891b2', secondary: '#06b6d4', light: '#22d3ee', gradient: 'from-cyan-600 to-blue-600', hover: 'from-cyan-700 to-blue-700' },
      { primary: '#9333ea', secondary: '#a855f7', light: '#c084fc', gradient: 'from-purple-600 to-blue-600', hover: 'from-purple-700 to-blue-700' },
      { primary: '#059669', secondary: '#10b981', light: '#34d399', gradient: 'from-emerald-600 to-cyan-600', hover: 'from-emerald-700 to-cyan-700' },
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // Add to cart function that calls backend API
  const addToCart = async (product) => {
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      // Call backend API to add product to cart
      await axios.post(`${API_BASE_URL}/checkout/cart/add`, null, {
        params: {
          userId: userId,
          productId: product.id,
          quantity: 1
        }
      });

      // Update cart count
      fetchCartCount(userId);
      
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Render different pages based on currentPage state
  if (currentPage === 'cart') {
    return <CartCheckoutPage onBack={() => {
      setCurrentPage('home');
      if (userId) fetchCartCount(userId);
    }} />;
  }
  
  if (currentPage === 'water-closets') {
    return <WaterClosetsPage 
      onBack={() => setCurrentPage('home')} 
      onAddToCart={addToCart}
      cartCount={cartCount}
      isAuthenticated={!!userRole}
    />;
  }
  
  if (currentPage === 'basins') {
    return <BasinsPage 
      onBack={() => setCurrentPage('home')} 
      onAddToCart={addToCart}
      cartCount={cartCount}
      isAuthenticated={!!userRole}
    />;
  }
  
  if (currentPage === 'other-products') {
    return <OtherProductsPage 
      onBack={() => setCurrentPage('home')} 
      onAddToCart={addToCart}
      cartCount={cartCount}
      isAuthenticated={!!userRole}
    />;
  }
  
  if (currentPage === 'bathroom-sets') {
    return <BathroomSetsPage 
      onBack={() => setCurrentPage('home')} 
      onAddToCart={addToCart}
      cartCount={cartCount}
      isAuthenticated={!!userRole}
    />;
  }
  
  if (currentPage === 'products') {
    return <ProductsPage 
      onBack={() => setCurrentPage('home')} 
      onAddToCart={addToCart}
      cartCount={cartCount}
    />;
  }

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="shop-header-content">
          <div className="shop-header-inner">
            {/* Logo Section */}
            <div className="shop-logo-section">
              <div className="shop-logo">
                <div className="shop-logo-main">Kodikara</div>
                <div className="shop-logo-sub">ENTERPRISES</div>
              </div>
              <div className="shop-tagline">Premium Bathware Solutions</div>
            </div>

            {/* Dashboard and Cart Buttons OR Login Button */}
            <div className="shop-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {userRole ? (
                <>
                  {/* Dashboard Button - Shows based on user role */}
                  <button 
                    onClick={() => navigate(userRole === 'ADMIN' ? '/admin' : '/customer')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1.25rem',
                      background: 'linear-gradient(to right, #2563eb, #0891b2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{userRole === 'ADMIN' ? 'Admin Dashboard' : 'Customer Dashboard'}</span>
                  </button>
                  
                  <button onClick={() => setCurrentPage('cart')} className="shop-cart-button">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="hidden sm:block text-sm font-medium">Cart</span>
                    {cartCount > 0 && <span className="shop-cart-count">{cartCount}</span>}
                  </button>
                </>
              ) : (
                /* Login Button - Shows when not authenticated */
                <button 
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(to right, #2563eb, #0891b2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <span>Login</span>
                </button>
              )}
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
            Transform Your
            <span className="shop-hero-gradient">Bathroom Experience</span>
          </h1>
          <p className="shop-hero-description">
            Discover our premium collection of bathware solutions, from luxury shower systems to elegant fixtures. 
            Quality meets style in every product we offer.
          </p>
        </div>
        
        <div className="shop-floating shop-floating-1"></div>
        <div className="shop-floating shop-floating-2"></div>
        <div className="shop-floating shop-floating-3"></div>
      </section>

      {/* Categories Section */}
      <section className="shop-categories">
        <div className="shop-categories-inner">
          <div className="shop-categories-header">
            <h2 className="shop-categories-title">
              Explore Our
              <span className="shop-categories-subtitle">Product Categories</span>
            </h2>
            <p className="shop-categories-description">
              Discover our premium collection organized by category. Each category offers unique solutions for your bathroom needs.
            </p>
          </div>

          {/* Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Water Closets */}
            <div 
              onClick={() => setCurrentPage('water-closets')}
              className="category-card-custom"
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '1';
                if (button) button.style.opacity = '1';
                if (img) img.style.transform = 'scale(1.1)';
                if (title) title.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '0';
                if (button) button.style.opacity = '0';
                if (img) img.style.transform = 'scale(1)';
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)' }}>
                <img 
                  src="/images/Water Closets Category Icon.png" 
                  alt="Water Closets" 
                  className="category-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0', transition: 'transform 0.5s ease' }}
                />
                {/* Hover Overlay */}
                <div className="hover-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', opacity: 0, transition: 'opacity 0.3s ease' }}></div>
                {/* View Collection Button */}
                <div className="hover-button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}>
                  <button style={{ background: 'linear-gradient(to right, #2563eb, #06b6d4)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', cursor: 'pointer' }}>
                    View Collection
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 className="category-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>Water Closets</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>Premium toilets and commode systems for modern bathrooms</p>
              </div>
            </div>

            {/* Basins */}
            <div 
              onClick={() => setCurrentPage('basins')}
              className="category-card-custom"
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '1';
                if (button) button.style.opacity = '1';
                if (img) img.style.transform = 'scale(1.1)';
                if (title) title.style.color = '#06b6d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '0';
                if (button) button.style.opacity = '0';
                if (img) img.style.transform = 'scale(1)';
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%)' }}>
                <img 
                  src="/images/Basins Category Icon.png" 
                  alt="Basins" 
                  className="category-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0', transition: 'transform 0.5s ease' }}
                />
                <div className="hover-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', opacity: 0, transition: 'opacity 0.3s ease' }}></div>
                <div className="hover-button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}>
                  <button style={{ background: 'linear-gradient(to right, #06b6d4, #2563eb)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', cursor: 'pointer' }}>
                    View Collection
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 className="category-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>Basins</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>Elegant wash basins and sinks for every style</p>
              </div>
            </div>
                    
            {/* Bathroom Sets */}
            <div 
              onClick={() => setCurrentPage('bathroom-sets')}
              className="category-card-custom"
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '1';
                if (button) button.style.opacity = '1';
                if (img) img.style.transform = 'scale(1.1)';
                if (title) title.style.color = '#9333ea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '0';
                if (button) button.style.opacity = '0';
                if (img) img.style.transform = 'scale(1)';
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(135deg, #faf5ff 0%, #dbeafe 100%)' }}>
                <img 
                  src="/images/Bathroom Sets Category Icon.png" 
                  alt="Bathroom Sets" 
                  className="category-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0', transition: 'transform 0.5s ease' }}
                />
                <div className="hover-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', opacity: 0, transition: 'opacity 0.3s ease' }}></div>
                <div className="hover-button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}>
                  <button style={{ background: 'linear-gradient(to right, #9333ea, #2563eb)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', cursor: 'pointer' }}>
                    View Collection
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 className="category-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>Bathroom Sets</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>Complete shower systems and bathroom packages</p>
              </div>
            </div>

            {/* Other Products */}
            <div 
              onClick={() => setCurrentPage('other-products')}
              className="category-card-custom"
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '1';
                if (button) button.style.opacity = '1';
                if (img) img.style.transform = 'scale(1.1)';
                if (title) title.style.color = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                const overlay = e.currentTarget.querySelector('.hover-overlay');
                const button = e.currentTarget.querySelector('.hover-button');
                const img = e.currentTarget.querySelector('.category-img');
                const title = e.currentTarget.querySelector('.category-title');
                if (overlay) overlay.style.opacity = '0';
                if (button) button.style.opacity = '0';
                if (img) img.style.transform = 'scale(1)';
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(135deg, #ecfdf5 0%, #cffafe 100%)' }}>
                <img 
                  src="/images/Other Products Category icon.png" 
                  alt="Other Products" 
                  className="category-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0', transition: 'transform 0.5s ease' }}
                />
                <div className="hover-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', opacity: 0, transition: 'opacity 0.3s ease' }}></div>
                <div className="hover-button" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}>
                  <button style={{ background: 'linear-gradient(to right, #059669, #06b6d4)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', cursor: 'pointer' }}>
                    View Collection
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 className="category-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>Other Products</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>Tiles, accessories, and miscellaneous bathroom items</p>
              </div>
            </div>
          </div>
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

export default ProductHomePage;

