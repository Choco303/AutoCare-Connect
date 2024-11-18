import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/adminHomepage.css';

const AdminHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="admin-homepage-container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <header className="admin-homepage-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="admin-homepage-menu-icon"
                />
                <h1 className="admin-homepage-banner-title">Admin Homepage</h1>
                <Logout />
            </header>

            {/* Centered Content */}
            <div className="admin-homepage-content">
                <h2 className="admin-homepage-title">Admin Homepage</h2>
            </div>
        </div>
    );
};

export default AdminHomepage;
