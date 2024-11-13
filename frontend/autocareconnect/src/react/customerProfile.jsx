import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/customerProfile.css';

const CustomerProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="customer-profile-container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <header className="header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">Customer Profile</h1>
            </header>

            {/* Centered Content */}
            <div className="profile-content">
                <h2>Customer Profile</h2>
            </div>
        </div>
    );
};

export default CustomerProfile;
