import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import AdminUserPage from "./pages/AdminUserPage";
import ProductHomePage from "./pages/ProductHomePage";
import AdminQuotationsPage from "./pages/AdminQuotations";
import AdminTicket from "./pages/AdminTicket";
import UserTicket from "./pages/UserTicket";
import CustomerOrders from "./pages/CustomerOrders";
import AdminProductManagement from "./pages/AdminProductManagement";
import CartCheckoutPage from "./pages/CartCheckoutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

function App() {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log("🔄 App.js RENDER - Current role:", role);

    useEffect(() => {
        console.log("✅ App.js useEffect running");
        const savedRole = sessionStorage.getItem('userRole');
        console.log("📦 Saved role from sessionStorage:", savedRole);
        if (savedRole) {
            console.log("✅ Setting role to:", savedRole);
            setRole(savedRole);
        } else {
            console.log("⚠️ No saved role found");
        }
        setIsLoading(false);
    }, []);

    const handleRoleChange = (newRole) => {
        console.log("🔧 handleRoleChange called with:", newRole);
        if (!newRole) {
            console.log("🗑️ Clearing sessionStorage");
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('userId');
        }
        console.log("📝 Setting role state to:", newRole);
        setRole(newRole);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductHomePage />} />
                <Route path="/login" element={<LoginPage setRole={handleRoleChange} />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/admin" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN" isLoading={isLoading}>
                        <AdminPage />
                    </ProtectedRoute>
                } />
                <Route path="/customer" element={
                    <ProtectedRoute role={role} requiredRole="USER" isLoading={isLoading}>
                        <CustomerPage />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN" isLoading={isLoading}>
                        <AdminUserPage />
                    </ProtectedRoute>
                } />

                {/* Standalone Product Home Page (like OOAD project) - Self-contained with state-based navigation */}
                <Route path="/shop" element={<ProductHomePage />} />

                {/* Quotations and Tickets */}
                <Route path="/admin/quotations" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN" isLoading={isLoading}>
                        <AdminQuotationsPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/tickets" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN" isLoading={isLoading}>
                        <AdminTicket />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute role={role} requiredRole="ADMIN" isLoading={isLoading}>
                        <AdminProductManagement />
                    </ProtectedRoute>
                } />
                <Route path="/user/tickets" element={
                    <ProtectedRoute role={role} requiredRole="USER" isLoading={isLoading}>
                        <UserTicket />
                    </ProtectedRoute>
                } />
                <Route path="/user/orders" element={
                    <ProtectedRoute role={role} requiredRole="USER" isLoading={isLoading}>
                        <CustomerOrders />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute role={role} requiredRole="USER" isLoading={isLoading}>
                        <CartCheckoutPage />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;