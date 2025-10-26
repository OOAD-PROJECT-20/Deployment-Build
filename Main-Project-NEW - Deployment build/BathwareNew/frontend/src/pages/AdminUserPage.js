import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import "./AdminUserPage.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';


const AdminUserPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filterRole, setFilterRole] = useState("ALL");
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchTelephone, setSearchTelephone] = useState("");

    const fetchUsers = useCallback(async () => {
        try {
            const url = `${API_BASE_URL}/api/admin/users/search?name=${encodeURIComponent(
                searchName
            )}&email=${encodeURIComponent(
                searchEmail
            )}&telephone=${encodeURIComponent(searchTelephone)}`;

            const res = await fetch(url);
            const data = await res.json();

            const userArray = Array.isArray(data) ? data : [];

            const filtered = userArray.filter((u) => {
                if (filterRole === "ALL") return true;
                if (filterRole === "ADMIN") return u.authority.startsWith("ADMIN");
                if (filterRole === "CUSTOMER") return u.authority === "CUSTOMER";
                return false;
            });

            setUsers(filtered);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
        }
    }, [filterRole, searchName, searchEmail, searchTelephone]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

            <div className="page-container">
                <h2>Admin User Management</h2>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Telephone"
                    value={searchTelephone}
                    onChange={(e) => setSearchTelephone(e.target.value)}
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="ALL">All</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">Customer</option>
                </select>
            </div>

            <table className="user-table">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Customer ID</th>
                    <th>Admin ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>Authority</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.customerId ?? "-"}</td>
                        <td>{u.adminId ?? "-"}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.telephone}</td>
                        <td
                            style={{
                                color: u.authority.startsWith("ADMIN")
                                    ? "blue"
                                    : "green",
                            }}
                        >
                            {u.authority}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
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

export default AdminUserPage;
