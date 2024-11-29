import React, { useState, useEffect } from 'react';
import './css/sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [username, setUsername] = useState(null); // tracks if you are logged in
    const [role, setRole] = useState(null); // tracks if you are customer, mechanic, or admin
    const navigate = useNavigate();

    useEffect(() => {
        // get the username from the local storage
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

    // depending on the username, it will go the according profile page
    const openProfile = () => {
        if (username) {
            if (role === 'customer') {
                navigate('/customerHomepage');
            } else if (role === 'admin') {
                navigate('/adminHomepage');
            } else if (role === 'mechanic') {
                navigate('/mechanicHomepage');
            }
        } else {
            setShowProfileModal(true);
        }
        toggleSidebar();
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    // this is for if you are not logged in
    const handleRoleClick = (role) => {
        if (role === 'Customer') {
            navigate('/login');
        } else if (role === 'Admin') {
            navigate('/adminLogin');
        } else if (role === 'Mechanic') {
            navigate('/mechanicLogin');
        }
        closeProfileModal();
    };

    return (
        <div>
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
                    </ul>
                </nav>
            </div>

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
