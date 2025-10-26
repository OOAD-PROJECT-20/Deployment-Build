import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import axios from "axios";
import "./CartPage.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';

export default function CheckoutPage({ onBack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("QUOTATION");
  const [cartItems, setCartItems] = useState([]);
  const [approvedQuotations, setApprovedQuotations] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ qname: "", address: "", qnumber: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Get current user ID from sessionStorage
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        // Try to get username from sessionStorage (stored during login)
        const username = sessionStorage.getItem('username');
        
        if (username) {
          // Search for user by username to get user ID
          const response = await axios.get(`${API_BASE_URL}/api/admin/users/search?name=${encodeURIComponent(username)}`);
          
          if (response.data && response.data.length > 0) {
            const user = response.data.find(u => u.username === username);
            
            if (user) {
              setUserId(user.userId);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error fetching user ID:', error);
        console.error('❌ Error details:', error.response?.data);
        // Fallback to a default user ID if needed
        setUserId(3);
      } finally {
        setLoadingUser(false);
      }
    };

    getCurrentUserId();
  }, []);

  // ------------------- Fetch Cart Items -------------------
  useEffect(() => {
    if (activeTab === "QUOTATION" && userId && !loadingUser) {
      setLoadingCart(true);
      axios
        .get(`${API_BASE_URL}/checkout/cart/${userId}`)
        .then((res) => setCartItems(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingCart(false));
    }
  }, [activeTab, userId, loadingUser]);

  // ------------------- Update Cart Quantity -------------------
  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    axios
      .put(`${API_BASE_URL}/checkout/cart/update/${cartId}?quantity=${newQuantity}`)
      .then(() => {
        setCartItems(prev =>
          prev.map(item =>
            item.id === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch((err) => {
        console.error("Error updating quantity:", err);
        alert("Failed to update quantity");
      });
  };

  // ------------------- Delete Cart Item -------------------
  const handleDeleteItem = (cartId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    axios
      .delete(`${API_BASE_URL}/checkout/cart/delete/${cartId}`)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.id !== cartId));
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        alert("Failed to delete item");
      });
  };

  // ------------------- Fetch Approved Quotations -------------------
  useEffect(() => {
    if (activeTab === "PAYMENT" && userId && !loadingUser) {
      setLoadingPayments(true);
      
      // Fetch approved quotations for this user
      axios
        .get(`${API_BASE_URL}/checkout/quotation/customer/${userId}/approved`)
        .then((res) => {
          setApprovedQuotations(res.data);
        })
        .catch((err) => {
          console.error('Error fetching approved quotations:', err);
          
          // Fallback: Get all quotations and show approved ones
          axios
            .get(`${API_BASE_URL}/checkout/quotation/admin/all`)
            .then((res) => {
              const approvedQuotations = res.data.filter(q => q.qstatus === 'APPROVED');
              setApprovedQuotations(approvedQuotations);
            })
            .catch((fallbackErr) => {
              console.error('Fallback also failed:', fallbackErr);
              setApprovedQuotations([]);
            });
        })
        .finally(() => setLoadingPayments(false));
    }
  }, [activeTab, userId, loadingUser]);

  // ------------------- Quotation Tab Logic -------------------
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.qname.trim()) newErrors.qname = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.qnumber.trim()) newErrors.qnumber = "Phone number is required";
    else if (!/^\d{10}$/.test(form.qnumber))
      newErrors.qnumber = "Phone number must be 10 digits";
    return newErrors;
  };

  const handleQuotationSubmit = () => {
    if (!userId) {
      alert("User not authenticated. Please login again.");
      return;
    }
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    axios
      .post("${API_BASE_URL}/checkout/quotation/request", { userId, ...form })
      .then(() => {
        setSuccessMessage("Quotation created successfully!");
        setCartItems([]);
        setShowPopup(false);
        setForm({ qname: "", address: "", qnumber: "" });
        setErrors({});
        setTimeout(() => setSuccessMessage(""), 5000);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create quotation");
      });
  };

  // ------------------- Payment Tab Logic -------------------
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handlePaymentUpload = async () => {
    if (!selectedQuotation) {
      setPaymentMessage("Please select a quotation");
      return;
    }
    if (!file) {
      setPaymentMessage("Please select a payment slip");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quotationId", selectedQuotation);

    try {
      await axios.post("${API_BASE_URL}/orders/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPaymentMessage("Payment slip uploaded successfully! Stock has been updated.");
      setFile(null);
      setSelectedQuotation(null);

      // Remove uploaded quotation from dropdown
      setApprovedQuotations((prev) =>
        prev.filter((q) => Number(q.quotationId) !== Number(selectedQuotation))
      );

      setTimeout(() => setPaymentMessage(""), 5000);
    } catch (err) {
      setPaymentMessage("Upload failed: " + (err.response?.data || err.message));
    }
  };

  // Show loading state while fetching user ID
  if (loadingUser) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Loading user information...</p>
      </div>
    );
  }

  // Show error if user ID is not available
  if (!userId) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>User not authenticated. Please login again.</p>
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
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  navigate('/');
                }
              }} 
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

      <div className="checkout-page">
        <h1>Checkout</h1>

        {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "QUOTATION" ? "active" : ""}
          onClick={() => setActiveTab("QUOTATION")}
        >
          Quotation
        </button>
        <button
          className={activeTab === "PAYMENT" ? "active" : ""}
          onClick={() => setActiveTab("PAYMENT")}
        >
          Payment
        </button>
      </div>

      {/* ------------------- Quotation Tab ------------------- */}
      {activeTab === "QUOTATION" && (
        <div className="tab-content">
          {successMessage && <p className="success">{successMessage}</p>}

          {loadingCart ? (
            <p>Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-container">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <p className="item-name">{item.product.name}</p>
                      <p className="item-price">Price: Rs. {item.product.price}</p>

                      {/* Quantity Controls */}
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-right">
                      <div className="item-total">
                        Rs. {item.product.price * item.quantity}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>Rs. 0</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <button className="checkout-btn" onClick={() => setShowPopup(true)}>
                  Request Quotation ({cartItems.length})
                </button>
              </div>
            </div>
          )}

          {/* Popup */}
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>Enter Details</h2>
                <input
                  name="qname"
                  placeholder="e.g. John Doe"
                  value={form.qname}
                  onChange={handleChange}
                />
                {errors.qname && <p className="error">{errors.qname}</p>}

                <input
                  name="address"
                  placeholder="e.g. No. 62 Isipathana Road, Colombo"
                  value={form.address}
                  onChange={handleChange}
                />
                {errors.address && <p className="error">{errors.address}</p>}

                <input
                  name="qnumber"
                  placeholder="e.g. 0712345678"
                  value={form.qnumber}
                  onChange={handleChange}
                />
                {errors.qnumber && <p className="error">{errors.qnumber}</p>}

                <button onClick={handleQuotationSubmit}>Submit</button>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------- Payment Tab ------------------- */}
      {activeTab === "PAYMENT" && (
        <div className="tab-content">
          {loadingPayments ? (
            <p>Loading approved quotations...</p>
          ) : approvedQuotations.length === 0 ? (
            <p>No approved quotations available for payment.</p>
          ) : (
            <div className="payment-upload">
              <p style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '5px',
                fontSize: '16px'
              }}>
                <strong>Please proceed with making your payments below:</strong>
              </p>

              {/* Bank Account Details Card */}
              <div style={{
                marginBottom: '25px',
                padding: '20px',
                backgroundColor: '#ffffff',
                border: '2px solid #25378C',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#25378C'
                }}>
                  Bank Account Details
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '10px',
                  fontSize: '15px'
                }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>Account Name:</span>
                  <span style={{ color: '#555' }}>Kodikara Enterprises</span>
                  
                  <span style={{ fontWeight: '600', color: '#333' }}>Account Number:</span>
                  <span style={{ color: '#555' }}>7894-5612-3012</span>
                  
                  <span style={{ fontWeight: '600', color: '#333' }}>Bank:</span>
                  <span style={{ color: '#555' }}>BOC (Bank of Ceylon)</span>
                  
                  <span style={{ fontWeight: '600', color: '#333' }}>Branch:</span>
                  <span style={{ color: '#555' }}>Battaramulla</span>
                </div>
              </div>

              <label>Select Approved Quotation:</label>
              <select
                value={selectedQuotation || ""}
                onChange={(e) => setSelectedQuotation(e.target.value)}
              >
                <option value="">--Select--</option>
                {approvedQuotations.map((q) => (
                  <option key={q.quotationId} value={q.quotationId}>
                    ID: {q.quotationId} - {q.qname} - Rs. {q.totalPrice}
                  </option>
                ))}
              </select>

              <div className="file-upload">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {file && <p className="file-name">Selected: {file.name}</p>}
              </div>

              <button onClick={handlePaymentUpload}>Submit Payment</button>
              {paymentMessage && <p className="success">{paymentMessage}</p>}
            </div>
          )}
        </div>
      )}
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
}