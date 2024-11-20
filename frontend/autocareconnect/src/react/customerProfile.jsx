import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/customerProfile.css';
import menuIcon from './images/menu.png'; // Ensure this is imported correctly
const CustomerProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header Banner */}
            <header className="header-banner">
                <img
                    src={menuIcon}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">Customer Profile</h1>
            </header>

            {/* Profile Information Section */}
            <section className="profile-info-container">
                {/* User Info Box */}
                <div className="user-info">
                    <div className="username">User 01</div>
                </div>

                {/* Service Details Box */}
                <div className="info-box">
                    <label>Service:</label>
                    <input type="text" value="Oil Change" readOnly />

                    <label>Car:</label>
                    <input type="text" value="Toyota" readOnly />

                    <label>Appointment Date:</label>
                    <input type="text" value="01/01/2024" readOnly />

                    <label>Complete Date:</label>
                    <input type="text" value="01/02/2024" readOnly />
                </div>

                {/* Contact Info Box */}
                <div className="info-box">
                    <label>Email:</label>
                    <input type="email" value="John.Smith@email.com" readOnly />

                    <label>Phone:</label>
                    <input type="text" value="XXX-XXX-XXXX" readOnly />

                    <button className="button">Change Email</button>
                    <button className="button">Change Password</button>
                    <button className="button">Change Phone Number</button>
                </div>

                {/* Receipt Box */}
                <div className="receipt-box">
                    <label>Receipt:</label>
                    <p>Transaction ID: XXXXXXX</p>
                </div>
            </section>

            {/* Action Buttons */}
            <section className="action-buttons">
                <button className="button">Rewards</button>
                <button className="button">Appointment</button>
                <button className="button">Leave a Review</button>
                <button className="button">Repair Information</button>
            </section>

            {/* Footer (Reuse from HomePage) */}
            <footer className="footer-banner">
                <div className="footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo" />
            </footer>
        </div>
    );
};

export default CustomerProfile;
