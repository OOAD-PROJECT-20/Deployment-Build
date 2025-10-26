import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CartPage.css";

export default function CheckoutPage() {
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

  const userId = 1; // Replace with actual logged-in user ID

  // ------------------- Fetch Cart Items -------------------
  useEffect(() => {
    if (activeTab === "QUOTATION") {
      fetchCartItems();
    }
  }, [activeTab]);

  const fetchCartItems = () => {
    setLoadingCart(true);
    axios
      .get(`http://localhost:8081/checkout/cart/${userId}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCart(false));
  };

  // ------------------- Update Cart Quantity -------------------
  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    axios
      .put(`http://localhost:8081/checkout/cart/update/${cartId}?quantity=${newQuantity}`)
      .then(() => {
        setCartItems(prev =>
          prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
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
      .delete(`http://localhost:8081/checkout/cart/delete/${cartId}`)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        alert("Failed to delete item");
      });
  };

  // ------------------- Fetch Approved Quotations -------------------
  useEffect(() => {
    if (activeTab === "PAYMENT") {
      setLoadingPayments(true);
      axios
        .get(`http://localhost:8081/checkout/quotation/customer/${userId}/approved`)
        .then((res) => {
          setApprovedQuotations(res.data);
        })
        .catch((err) => console.error("Error fetching approved quotations:", err))
        .finally(() => setLoadingPayments(false));
    }
  }, [activeTab]);

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
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    axios
      .post("http://localhost:8081/checkout/quotation/request", { userId, ...form })
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
      await axios.post("http://localhost:8081/orders/upload", formData, {
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

  return (
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
                  <div key={item.cartId} className="cart-item">
                    <div className="item-info">
                      <p className="item-name">{item.product.name}</p>
                      <p className="item-price">Price: Rs. {item.product.price}</p>

                      {/* Quantity Controls */}
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
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
                        onClick={() => handleDeleteItem(item.cartId)}
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
              <label>Select Approved Quotation:</label>
              <select
                value={selectedQuotation || ""}
                onChange={(e) => setSelectedQuotation(e.target.value)}
              >
                <option value="">--Select--</option>
                {approvedQuotations.map((q) => (
                  <option key={q.quotationId} value={q.quotationId}>
                    {q.qname} - Rs. {q.totalPrice}
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
  );
}