import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/customerProfile.css';
import menuIcon from './images/menu.png'; // Ensure this is imported correctly
import userIcon from './images/user-icon.png'; // Ensure this is imported correctly
import logo from './images/logo.png'; // Import the logo image if needed in the footer

const CustomerProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="customer-profile-container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header Banner */}
            <header className="customer-profile-header-banner">
                <img
                    src={menuIcon}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="customer-profile-menu-icon"
                />
                <h1 className="customer-profile-banner-title">Customer Profile</h1>
            </header>

            {/* Profile Information Section */}
            <section className="customer-profile-profile-info-container">
                {/* User Info Box */}
                <div className="customer-profile-user-info">
                    <img
                        src={userIcon}
                        alt="User Icon"
                        className="customer-profile-user-icon"
                    />
                    <div className="customer-profile-username">User 01</div>
                </div>

                {/* Service Details Box */}
                <div className="customer-profile-info-box">
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
                <div className="customer-profile-info-box">
                    <label>Email:</label>
                    <input type="email" value="John.Smith@email.com" readOnly />

                    <label>Phone:</label>
                    <input type="text" value="XXX-XXX-XXXX" readOnly />

                    <button className="customer-profile-button">Change Email</button>
                    <button className="customer-profile-button">Change Password</button>
                    <button className="customer-profile-button">Change Phone Number</button>
                </div>

                {/* Receipt Box */}
                <div className="customer-profile-receipt-box">
                    <label>Receipt:</label>
                    <p>Transaction ID: XXXXXXX</p>
                </div>
            </section>

            {/* Action Buttons */}
            <section className="customer-profile-action-buttons">
                <button className="customer-profile-button">Rewards</button>
                <button className="customer-profile-button">Appointment</button>
                <button className="customer-profile-button">Leave a Review</button>
                <button className="customer-profile-button">Repair Information</button>
            </section>

            {/* Footer */}
            <footer className="customer-profile-footer">
                <div className="customer-profile-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={logo} alt="Logo" className="customer-profile-footer-logo" />
            </footer>
        </div>
    );
};

export default CustomerProfile;
