import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import "./AdminTicket.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const AdminTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const response = await fetch("${API_BASE_URL}/api/support");
            const data = await response.json();
            setTickets(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching tickets:", err);
            setTickets([]);
            setLoading(false);
        }
    };

    const handleRemarkChange = async (ticketId, newRemark) => {
        try {
            await fetch(`${API_BASE_URL}/api/support/${ticketId}/remark`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ remark: newRemark }),
            });
            loadTickets();
        } catch (err) {
            console.error("Error updating remark:", err);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await fetch(`${API_BASE_URL}/api/support/${ticketId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            loadTickets();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/support/${ticketId}`, { 
                method: "DELETE" 
            });
            loadTickets();
        } catch (err) {
            console.error("Error deleting ticket:", err);
        }
    };

    if (loading) return <p className="tickets-loading">Loading tickets...</p>;

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

            <div className="admin-tickets">
                <h2>All Support Tickets</h2>
            <div className="tickets-table-wrapper">
                <table className="tickets-table">
                    <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>User ID</th>
                        <th>Support Type</th>
                        <th>Description</th>
                        <th>Remark</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>No tickets found</td>
                        </tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr key={ticket.ticketId}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.userId}</td>
                                <td>{ticket.supportType || "N/A"}</td>
                                <td>{ticket.description || ""}</td>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={ticket.remark || ""}
                                        onBlur={(e) => handleRemarkChange(ticket.ticketId, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={ticket.status || "Pending"}
                                        onChange={(e) => handleStatusChange(ticket.ticketId, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Solved">Solved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(ticket.ticketId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
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

export default AdminTickets;
