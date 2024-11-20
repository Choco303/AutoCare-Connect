import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/customerHomepage.css';
import menuIcon from './images/menu.png';
import Logout from "./logout"; // Ensure this is imported correctly

const CustomerHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="customer-homepage-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <header className="customer-homepage-header-banner">
                <img
                    src={menuIcon}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="customer-homepage-menu-icon"
                />
                <h1 className="customer-homepage-banner-title">Customer Profile</h1>
                <Logout />
            </header>

            <section className="customer-homepage-profile-info-container">
                <div className="customer-homepage-user-info">
                    <div className="username">User 01</div>
                </div>

                <div className="customer-homepage-info-box">
                    <label>Service:</label>
                    <input type="text" value="Oil Change" readOnly/>

                    <label>Car:</label>
                    <input type="text" value="Toyota" readOnly/>

                    <label>Appointment Date:</label>
                    <input type="text" value="01/01/2024" readOnly/>

                    <label>Complete Date:</label>
                    <input type="text" value="01/02/2024" readOnly/>
                </div>
                {/* Other sections follow the same naming */}
            </section>
        </div>

    );
};

export default CustomerHomepage;