import React, { useState, useEffect } from 'react';
import './css/sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [username, setUsername] = useState(null); // Tracks the logged-in user
    const [role, setRole] = useState(null); // Tracks the role (customer/admin/mechanic)
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a customer, admin, or mechanic is logged in
        const customerUsername = localStorage.getItem('customerUsername');
        const adminUsername = localStorage.getItem('adminUsername');
        const mechanicUsername = localStorage.getItem('mechanicUsername');

        if (customerUsername) {
            setUsername(customerUsername);
            setRole('customer');
        } else if (adminUsername) {
            setUsername(adminUsername);
            setRole('admin');
        } else if (mechanicUsername) {
            setUsername(mechanicUsername);
            setRole('mechanic');
        } else {
            setUsername(null);
            setRole(null);
        }
    }, []);

    const openProfile = () => {
        if (username) {
            if (role === 'customer') {
                navigate('/customerHomepage');
            } else if (role === 'admin') {
                navigate('/adminHomepage');
            } else if (role === 'mechanic') {
                navigate('/mechanicHomepage'); // Corrected to mechanicHomepage
            }
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
            navigate('/login'); // Navigate to CustomerLogin page
        } else if (role === 'Admin') {
            navigate('/adminLogin'); // Navigate to AdminLogin page
        } else if (role === 'Mechanic') {
            navigate('/mechanicLogin');
        }
        closeProfileModal();
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
                            <span className="profile-link">Profile</span>
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
                        <li className="sidebar-nav-item">
                            <Link to="/vehicle" onClick={toggleSidebar}>vehmodels</Link>
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
