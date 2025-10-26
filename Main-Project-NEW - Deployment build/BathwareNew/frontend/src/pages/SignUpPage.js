import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';
import './ShopPages.css';
import API_BASE_URL from '../config/api';


const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
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

    const handleSignUp = async (e) => {
        e.preventDefault();
        playBeep();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, telephone, password }),
            });
            const data = await res.json();
            if (data.success) {
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (err) {
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

            <div className="signup-page" style={{ padding: '4rem 2rem' }}>
                <div className="signup-card">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Telephone"
                            value={telephone}
                            onChange={e => setTelephone(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                    {error && <p className="error">{error}</p>}
                    <p className="signup-footer">
                        Already have an account?{" "}
                        <span
                            onClick={() => { playBeep(); navigate("/"); }}
                            className="login-link"
                        >
                        Login here
                    </span>
                    </p>
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
                        <div className="border-t border-blue-600 pt-8 text-blue-200">
                            <p>&copy; 2025 Kodikara Enterprises. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

};

export default SignUpPage;
