import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const LoginPage = ({ setRole }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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

    const handleLogin = async (e) => {
        e.preventDefault();
        playBeep();
        setError("");

        console.log("🔐 LOGIN ATTEMPT");
        console.log("   Username:", username);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("📡 Response status:", res.status);
            const data = await res.json();
            console.log("📡 Response data:", data);

            if (data.role) {
                console.log("✅ Login successful - Role:", data.role);

                // Store ALL necessary data in sessionStorage (tab-specific)
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userRole', data.role);
                console.log("💾 Stored in sessionStorage - userRole:", sessionStorage.getItem('userRole'));

                // Store userId if available
                if (data.userId || data.id) {
                    sessionStorage.setItem('userId', data.userId || data.id);
                    console.log("💾 Stored userId:", sessionStorage.getItem('userId'));
                }

                // Set role in App.js state
                console.log("📝 Calling setRole with:", data.role);
                setRole(data.role);

                // Navigate to shop page for all users
                console.log("🚀 Navigating to: /shop");
                navigate("/shop");
            } else {
                console.log("❌ No role in response");
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("❌ Login error:", err);
            setError("Server error");
        }
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

            <div className="login-container" style={{ padding: '4rem 2rem' }}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p>
                    Don't have an account?{" "}
                    <span
                        onClick={() => {
                            playBeep();
                            navigate("/signup");
                        }}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                        Sign up here
                    </span>
                </p>
                <p>Test credentials: admin/adminpass, user/userpass</p>
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

export default LoginPage;