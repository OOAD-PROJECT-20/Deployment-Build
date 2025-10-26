import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminPage.css';
import './ShopPages.css';

const AdminPage = () => {
    const navigate = useNavigate();

    const playBeep = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const handleNavigate = (path) => {
        playBeep();
        navigate(path);
    };

    return (
        <div className="page-container">
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
                    </div>
                </div>
            </header>

            <div style={{ padding: '4rem 2rem' }}>
                <h2>Admin Dashboard</h2>
                <p>Only accessible by admins</p>

                <div className="admin-buttons">
                    <button onClick={() => handleNavigate("/shop")}>Product Shop</button>
                    <button onClick={() => handleNavigate("/users")}>Manage Users</button>
                    <button onClick={() => handleNavigate("/admin/products")}>Manage Products</button>
                    <button onClick={() => handleNavigate("/admin/quotations")}>Customer Orders</button>
                    <button onClick={() => handleNavigate("/admin/tickets")}>Customer Support Tickets</button>
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
                        
                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                sessionStorage.clear();
                                navigate('/login');
                            }}
                            style={{
                                background: '#dc2626',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                marginBottom: '2rem',
                                transition: 'background 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.background = '#dc2626'}
                        >
                            Logout
                        </button>

                        <div className="border-t border-blue-600 pt-8 text-blue-200">
                            <p>&copy; 2025 Kodikara Enterprises. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminPage;