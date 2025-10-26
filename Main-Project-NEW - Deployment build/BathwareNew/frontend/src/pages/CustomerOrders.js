import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import "./CustomerOrders.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';

function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer orders
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      console.error("No userId found in sessionStorage");
      setLoading(false);
      return;
    }

    console.log("Fetching orders for userId:", userId);
    
    fetch(`${API_BASE_URL}/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders data received:", data);
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  // Format product names with commas
  const formatProductNames = (items) => {
    if (!items || items.length === 0) return "No items";
    return items.map(item => `${item.productName} (x${item.quantity})`).join(", ");
  };

  if (loading) {
    return (
      <div className="customer-orders-container">
        <h2>My Orders</h2>
        <p>Loading your orders...</p>
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
              onClick={() => navigate('/customer')} 
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

      <div className="customer-orders-container">
        <h2>My Orders</h2>
        <p className="subtitle">View all your orders and their status</p>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <a href="/shop" className="btn-primary">Browse Products</a>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Quotation ID</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Payment Status</th>
                <th>Delivery Status</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.quotationId}</td>
                  <td className="products-cell">
                    {formatProductNames(order.items)}
                  </td>
                  <td>Rs. {order.totalAmount}</td>
                  <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${order.deliverStatus}`}>
                      {order.deliverStatus}
                    </span>
                  </td>
                  <td>
                    {order.deliveredDate 
                      ? new Date(order.deliveredDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default CustomerOrders;

