import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import "./AdminQuotations.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';

function AdminPage() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING_QUOTATIONS");

  // Fetch quotations
  useEffect(() => {
    fetch(`${API_BASE_URL}/checkout/quotation/admin/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Quotations data received:", data);
        // Ensure data is an array
        setQuotations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
        // Set empty array on error
        setQuotations([]);
        setLoading(false);
      });
  }, []);

  // Fetch orders
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/orders/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders data received:", data);
        // Ensure data is an array
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        // Set empty array on error
        setOrders([]);
      });
  }, []);

  // ========== QUOTATION HANDLERS ==========
  const handleApproveQuotation = (id) => {
    fetch(`${API_BASE_URL}/checkout/quotation/admin/${id}/approve`, {
      method: "POST",
    })
    .then((res) => {
      if (res.ok) {
        setQuotations((prev) =>
          prev.map((q) =>
            q.quotationId === id ? { ...q, qstatus: "APPROVED" } : q
          )
        );
      } else {
        console.error("Failed to approve quotation");
        alert("Failed to approve quotation");
      }
    })
    .catch((err) => {
      console.error("Error approving quotation:", err);
      alert("Error approving quotation");
    });
  };

  const handleRejectQuotation = (id) => {
    fetch(`${API_BASE_URL}/checkout/quotation/admin/${id}/reject`, {
      method: "POST",
    })
    .then((res) => {
      if (res.ok) {
        setQuotations((prev) =>
          prev.map((q) =>
            q.quotationId === id ? { ...q, qstatus: "REJECTED" } : q
          )
        );
      } else {
        console.error("Failed to reject quotation");
        alert("Failed to reject quotation");
      }
    })
    .catch((err) => {
      console.error("Error rejecting quotation:", err);
      alert("Error rejecting quotation");
    });
  };

  // ========== ORDER PAYMENT HANDLERS ==========
  const handleApprovePayment = (orderId) => {
    fetch(`${API_BASE_URL}/admin/orders/${orderId}/approve-payment`, {
      method: "POST",
    })
    .then((res) => {
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, paymentStatus: "APPROVED" } : o
          )
        );
      } else {
        console.error("Failed to approve payment");
        alert("Failed to approve payment");
      }
    })
    .catch((err) => {
      console.error("Error approving payment:", err);
      alert("Error approving payment");
    });
  };

  const handleRejectPayment = (orderId) => {
    fetch(`${API_BASE_URL}/admin/orders/${orderId}/reject-payment`, {
      method: "POST",
    })
    .then((res) => {
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, paymentStatus: "REJECTED" } : o
          )
        );
      } else {
        console.error("Failed to reject payment");
        alert("Failed to reject payment");
      }
    })
    .catch((err) => {
      console.error("Error rejecting payment:", err);
      alert("Error rejecting payment");
    });
  };

  // ========== DELIVERY STATUS HANDLER ==========
  const handleDeliveryStatusChange = (orderId, newStatus) => {
    fetch(
      `${API_BASE_URL}/admin/orders/${orderId}/delivery-status?status=${newStatus}`,
      { method: "POST" }
    )
    .then((res) => {
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, deliverStatus: newStatus } : o
          )
        );
      } else {
        console.error("Failed to update delivery status");
        alert("Failed to update delivery status");
      }
    })
    .catch((err) => {
      console.error("Error updating delivery status:", err);
      alert("Error updating delivery status");
    });
  };

  if (loading) return <p>Loading...</p>;

  // Filter data based on active tab
  const pendingQuotations = Array.isArray(quotations) ? quotations.filter((q) => q.qstatus === "PENDING") : [];
  const approvedQuotations = Array.isArray(quotations) ? quotations.filter((q) => q.qstatus === "APPROVED") : [];
  const pendingPayments = Array.isArray(orders) ? orders.filter((o) => o.paymentStatus === "PENDING") : [];
  const approvedPayments = Array.isArray(orders) ? orders.filter((o) => o.paymentStatus === "APPROVED") : [];

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

      <div className="admin-page">
        <h2>Admin Dashboard</h2>

        {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "PENDING_QUOTATIONS" ? "active" : ""}
          onClick={() => setActiveTab("PENDING_QUOTATIONS")}
        >
          Pending Quotations
        </button>
        <button
          className={activeTab === "APPROVED_QUOTATIONS" ? "active" : ""}
          onClick={() => setActiveTab("APPROVED_QUOTATIONS")}
        >
          Approved Quotations
        </button>
        <button
          className={activeTab === "PENDING_PAYMENTS" ? "active" : ""}
          onClick={() => setActiveTab("PENDING_PAYMENTS")}
        >
          Pending Payments
        </button>
        <button
          className={activeTab === "APPROVED_PAYMENTS" ? "active" : ""}
          onClick={() => setActiveTab("APPROVED_PAYMENTS")}
        >
          Approved Payments
        </button>
      </div>

      {/* ========== PENDING QUOTATIONS TAB ========== */}
      {activeTab === "PENDING_QUOTATIONS" && (
        <div className="tab-content">
          <h3>Pending Quotations</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Number</th>
                <th>Requested Date</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingQuotations.length === 0 ? (
                <tr>
                  <td colSpan="9">No pending quotations</td>
                </tr>
              ) : (
                pendingQuotations.map((q) => (
                  <tr key={q.quotationId}>
                    <td>{q.quotationId}</td>
                    <td>{q.qname}</td>
                    <td>{q.address}</td>
                    <td>{q.qnumber}</td>
                    <td>{new Date(q.requestDate).toLocaleString()}</td>
                    <td>
                      {q.items?.length > 0 ? (
                        <ul>
                          {q.items.map((item) => (
                            <li key={item.productId}>
                              {item.productName} - Qty: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No items"
                      )}
                    </td>
                    <td>Rs. {q.totalPrice}</td>
                    <td>
                      <span className="status PENDING">PENDING</span>
                    </td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveQuotation(q.quotationId)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectQuotation(q.quotationId)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== APPROVED QUOTATIONS TAB ========== */}
      {activeTab === "APPROVED_QUOTATIONS" && (
        <div className="tab-content">
          <h3>Approved Quotations</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Number</th>
                <th>Requested Date</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedQuotations.length === 0 ? (
                <tr>
                  <td colSpan="8">No approved quotations</td>
                </tr>
              ) : (
                approvedQuotations.map((q) => (
                  <tr key={q.quotationId}>
                    <td>{q.quotationId}</td>
                    <td>{q.qname}</td>
                    <td>{q.address}</td>
                    <td>{q.qnumber}</td>
                    <td>{new Date(q.requestDate).toLocaleString()}</td>
                    <td>
                      {q.items?.length > 0 ? (
                        <ul>
                          {q.items.map((item) => (
                            <li key={item.productId}>
                              {item.productName} - Qty: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No items"
                      )}
                    </td>
                    <td>Rs. {q.totalPrice}</td>
                    <td>
                      <span className="status APPROVED">APPROVED</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== PENDING PAYMENTS TAB ========== */}
      {activeTab === "PENDING_PAYMENTS" && (
        <div className="tab-content">
          <h3>Pending Payments</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Payment Slip</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="10">No pending payments</td>
                </tr>
              ) : (
                pendingPayments.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerEmail}</td>
                    <td>{order.phoneNumber}</td>
                    <td>
                      {order.items?.length > 0 ? (
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.productId}>
                              {item.productName} - Qty: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No items"
                      )}
                    </td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>{new Date(order.createdDate).toLocaleString()}</td>
                    <td>
                      <a
                        href={`${API_BASE_URL}/files/payment-slip/${order.orderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="payment-link"
                      >
                        View Payment Slip
                      </a>
                    </td>
                    <td>
                      <span className="status PENDING">PENDING</span>
                    </td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApprovePayment(order.orderId)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectPayment(order.orderId)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== APPROVED PAYMENTS TAB ========== */}
      {activeTab === "APPROVED_PAYMENTS" && (
        <div className="tab-content">
          <h3>Approved Payments - Manage Delivery</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Payment Status</th>
                <th>Delivery Status</th>
                <th>Update Delivery</th>
              </tr>
            </thead>
            <tbody>
              {approvedPayments.length === 0 ? (
                <tr>
                  <td colSpan="10">No approved payments</td>
                </tr>
              ) : (
                approvedPayments.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.address}</td>
                    <td>{order.phoneNumber}</td>
                    <td>
                      {order.items?.length > 0 ? (
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.productId}>
                              {item.productName} - Qty: {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No items"
                      )}
                    </td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>{new Date(order.createdDate).toLocaleString()}</td>
                    <td>
                      <span className="status APPROVED">APPROVED</span>
                    </td>
                    <td>
                      <span className={`status ${order.deliverStatus}`}>
                        {order.deliverStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.deliverStatus}
                        onChange={(e) =>
                          handleDeliveryStatusChange(
                            order.orderId,
                            e.target.value
                          )
                        }
                        className="delivery-select"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
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

export default AdminPage;