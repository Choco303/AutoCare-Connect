// Sidebar.jsx
import React, { useState } from 'react';
import './css/sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    const openProfileModal = (e) => {
        e.preventDefault();
        setShowProfileModal(true);
        toggleSidebar(); // Close the sidebar when opening the profile modal
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleRoleClick = (role) => {
        if (role === 'Customer') {
            navigate('/login'); // Navigate to the CustomerLogin page
        }
        console.log(`${role} login page clicked`);
        closeProfileModal();
    };

    return (
        <div>
            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>
                    &times;
                </button>
                <nav>
                    <ul>
                        <li className="nav-item" onClick={openProfileModal}>
                            <span className="profile-link">Profile</span>
                        </li>
                        <div className="sidebar-gap"></div>
                        <li className="nav-item">
                            <Link to="/" onClick={toggleSidebar}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/reviews" onClick={toggleSidebar}>Reviews</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/rewards" onClick={toggleSidebar}>Rewards</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Profile Modal Overlay */}
            {showProfileModal && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal">
                        <h3>Select Role</h3>
                        <button onClick={() => handleRoleClick('Customer')} className="role-button">Customer</button>
                        <button onClick={() => handleRoleClick('Mechanic')} className="role-button">Mechanic</button>
                        <button onClick={() => handleRoleClick('Admin')} className="role-button">Admin</button>
                        <button onClick={closeProfileModal} className="close-modal-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
