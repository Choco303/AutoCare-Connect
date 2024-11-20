import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './css/base.css';
import './css/customerHomepage.css';
import menuIcon from './images/menu.png';
import logo from './images/logo.png';

const CustomerHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="customer-homepage">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header */}
            <header className="customer-homepage-header">
                <img
                    src={menuIcon}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="customer-homepage-menu-icon"
                />
                <h1 className="customer-homepage-header-title">Customer Profile</h1>
                <Logout />
            </header>

            {/* Main Content */}
            <div className="customer-homepage-main">
                {/* User Box */}
                <div className="customer-homepage-user-box">
                    <span>User 01</span>
                </div>

                {/* Grid Section */}
                <section className="customer-homepage-grid-section">
                    {/* Service Box */}
                    <div className="customer-homepage-box customer-homepage-service-box">
                        <label htmlFor="service">Service:</label>
                        <InputText id="service" value="Oil Change" readOnly />
                        <label htmlFor="car">Car:</label>
                        <InputText id="car" value="Toyota" readOnly />
                        <label htmlFor="appointment">Appointment Date:</label>
                        <InputText id="appointment" value="01/01/2024" readOnly />
                        <label htmlFor="completion">Complete Date:</label>
                        <InputText id="completion" value="01/02/2024" readOnly />
                    </div>

                    {/* Contact Box */}
                    <div className="customer-homepage-box customer-homepage-contact-box">
                        <label htmlFor="email">Email:</label>
                        <InputText id="email" value="John.Smith@email.com" readOnly />
                        <label htmlFor="phone">Phone:</label>
                        <InputText id="phone" value="XXX-XXX-XXXX" readOnly />
                        <div className="customer-homepage-action-buttons">
                            <Button label="Change Email" className="customer-homepage-action-button" />
                            <Button label="Change Password" className="customer-homepage-action-button" />
                            <Button label="Change Phone Number" className="customer-homepage-action-button" />
                        </div>
                    </div>

                    {/* Receipt Box */}
                    <div className="customer-homepage-box customer-homepage-receipt-box">
                        <label>Receipt:</label>
                        <p>Transaction ID: XXXXXXX</p>
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="customer-homepage-action-buttons">
                    <Button label="Appointment" className="p-button-rounded customer-homepage-action-button" />
                    <Button label="Repair Information" className="p-button-rounded customer-homepage-action-button" />
                </section>
            </div>


            {/* Footer */}
            <footer className="customer-homepage-footer">
                <div className="customer-homepage-footer-text">
                    Providing quality car management services for your convenience.
                </div>
                <img src={logo} alt="Logo" className="customer-homepage-footer-logo" />
            </footer>
        </div>
    );
};

export default CustomerHomepage;
