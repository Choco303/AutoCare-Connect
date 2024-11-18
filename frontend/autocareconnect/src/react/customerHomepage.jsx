import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/customerHomepage.css';

const CustomerHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="customer-homepage-container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <header className="customer-homepage-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="customer-homepage-menu-icon"
                />
                <h1 className="customer-homepage-banner-title">Customer Homepage</h1>
                <Logout />
            </header>

            {/* Centered Content */}
            <div className="customer-homepage-content">
                <h2 className="customer-homepage-title">Customer Homepage</h2>
            </div>
        </div>
    );
};

export default CustomerHomepage;
