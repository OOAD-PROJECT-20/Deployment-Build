import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import "./UserTicket.css";
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const UserTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTicket, setNewTicket] = useState({
        supportType: "",
        description: ""
    });


    useEffect(() => {
        // Load debug info
        const userId = sessionStorage.getItem('userId');
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('userRole');

        console.log("🔍 DEBUG INFO:", { userId, username, role });
        
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            console.log("🔍 Fetching tickets for userId:", userId);
            
            if (!userId) {
                console.error("❌ No userId found in sessionStorage");
                setLoading(false);
                return;
            }
            
            console.log("📡 Calling API: ${API_BASE_URL}/api/support");
            const response = await fetch("${API_BASE_URL}/api/support");
            console.log("📡 Response status:", response.status);
            
            if (!response.ok) {
                console.error("❌ Response not OK:", response.status, response.statusText);
                setTickets([]);
                setLoading(false);
                return;
            }
            
            const data = await response.json();
            console.log("📦 Raw data from API:", data);
            console.log("📦 Data type:", typeof data, "Is array?", Array.isArray(data));
            
            if (!Array.isArray(data)) {
                console.error("❌ Data is not an array:", data);
                setTickets([]);
                setLoading(false);
                return;
            }
            
            const filteredTickets = data.filter((t) => t.userId === parseInt(userId));
            console.log("✅ Filtered tickets:", filteredTickets);
            setTickets(filteredTickets);
            setLoading(false);
        } catch (err) {
            console.error("❌ Error fetching tickets:", err);
            setTickets([]);
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                alert("Please login first");
                return;
            }

            if (!newTicket.supportType || !newTicket.description) {
                alert("Please fill in all fields");
                return;
            }

            const response = await fetch("${API_BASE_URL}/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    supportType: newTicket.supportType,
                    description: newTicket.description,
                    status: "Pending"
                }),
            });

            if (response.ok) {
                setNewTicket({ supportType: "", description: "" });
                loadTickets();
            } else {
                console.error("Failed to create ticket");
            }
        } catch (err) {
            console.error("Error creating ticket:", err);
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

            <div className="user-tickets">
            <h2>My Support Tickets</h2>
            
            {/* Create New Ticket Form */}
            <div className="create-ticket-form">
                <h3>Create New Ticket</h3>
                <form onSubmit={handleCreateTicket}>
                    <div className="form-group">
                        <label>Support Type:</label>
                        <select 
                            value={newTicket.supportType}
                            onChange={(e) => setNewTicket({...newTicket, supportType: e.target.value})}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Warranty">Warranty</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Product Inquiry">Product Inquiry</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea 
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            placeholder="Describe your issue..."
                            required
                        />
                    </div>
                    <button type="submit" className="create-btn">Create Ticket</button>
                </form>
            </div>

            {/* Existing Tickets Table */}
            <div className="tickets-table-wrapper">
                <h3>My Tickets</h3>
                <table className="tickets-table">
                    <thead>
                    <tr>
                        <th>Ticket ID</th>
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
                            <td colSpan="6" style={{ textAlign: "center" }}>No tickets found</td>
                        </tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr key={ticket.ticketId}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.supportType || "N/A"}</td>
                                <td>{ticket.description || ""}</td>
                                <td>{ticket.remark || "No response yet"}</td>
                                <td>
                                    <span className={`status-badge status-${ticket.status?.toLowerCase()}`}>
                                        {ticket.status || "Pending"}
                                    </span>
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

export default UserTickets;
