import React, { useState, useEffect } from 'react';
import './css/sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [username, setUsername] = useState(null); // Tracks the logged-in user
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a user is logged in
        const storedUsername = localStorage.getItem('customerUsername');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const openProfile = () => {
        if (username) {
            navigate('/customerProfile'); // Navigate directly to profile if logged in
        } else {
            setShowProfileModal(true); // Show modal to choose login page
        }
        toggleSidebar(); // Close the sidebar
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleRoleClick = (role) => {
        if (role === 'Customer') {
            navigate('/login'); // Navigate to the CustomerLogin page
        }
        if (role === 'Admin') {
            navigate('/adminLogin'); // Navigate to the CustomerLogin page
        }
        console.log(`${role} login page clicked`);
        closeProfileModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('customerUsername'); // Clear login state
        setUsername(null);
        navigate('/'); // Redirect to home page
    };

    return (
        <div>
            {/* Sidebar */}
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <button className="sidebar-close-btn" onClick={toggleSidebar}>
                    &times;
                </button>
                <nav>
                    <ul>
                        <li className="sidebar-nav-item" onClick={openProfile}>
                            <span className="profile-link">{username ? `Profile` : 'Profile'}</span>
                        </li>
                        <div className="sidebar-gap"></div>
                        <li className="sidebar-nav-item">
                            <Link to="/" onClick={toggleSidebar}>Home</Link>
                        </li>
                        <li className="sidebar-nav-item">
                            <Link to="/reviews" onClick={toggleSidebar}>Reviews</Link>
                        </li>
                        <li className="sidebar-nav-item">
                            <Link to="/rewards" onClick={toggleSidebar}>Rewards</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Profile Modal Overlay */}
            {showProfileModal && (
                <div className="sidebar-profile-modal-overlay">
                    <div className="sidebar-profile-modal">
                        <h3>Select Role</h3>
                        <button onClick={() => handleRoleClick('Customer')} className="sidebar-role-button">Customer</button>
                        <button onClick={() => handleRoleClick('Mechanic')} className="sidebar-role-button">Mechanic</button>
                        <button onClick={() => handleRoleClick('Admin')} className="sidebar-role-button">Admin</button>
                        <button onClick={closeProfileModal} className="sidebar-close-modal-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
