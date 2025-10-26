import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, requiredRole, isLoading, children }) => {
    console.log("🛡️ ProtectedRoute CHECK");
    console.log("   Current role:", role);
    console.log("   Required role:", requiredRole);
    console.log("   Is Loading:", isLoading);
    console.log("   Match:", role === requiredRole);

    // Show loading while checking localStorage
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #e5e7eb',
                        borderTop: '5px solid #2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!role) {
        console.log("❌ No role - redirecting to /");
        return <Navigate to="/" replace />;
    }

    if (role !== requiredRole) {
        console.log("❌ Role mismatch!");
        console.log("   Redirecting to:", role === "ADMIN" ? "/admin" : "/customer");
        return <Navigate to={role === "ADMIN" ? "/admin" : "/customer"} replace />;
    }

    console.log("✅ Access granted - rendering page");
    return children;
};

export default ProtectedRoute;