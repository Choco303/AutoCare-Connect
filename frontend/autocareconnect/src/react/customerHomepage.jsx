import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import './css/base.css';
import './css/customerHomepage.css';
import axios from 'axios';

const CustomerHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [customer, setCustomer] = useState({});
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toEmailPage = () => {
        navigate('/Change-Email');
    }

    const toPasswordPage = () => {
        navigate('/Change-Password');
    }

    const toPhonePage = () => {
        navigate('/Change-Phone');
    }

    const toRewardsPage = () => {
        navigate('/rewardsOverview');
    }

    const toRepairInfo = () => {
        navigate('/repairInfo');
    }

    useEffect(() => {
        const username = localStorage.getItem('customerUsername');
        if (username) {
            axios
                .get(`http://localhost:8080/api/customer/details/${username}`)
                .then((response) => {
                    setCustomer(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching customer details:', error);
                });
        }
    }, []);

    return (
        <div className="customer-homepage">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header */}
            <header className="customer-homepage-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="customer-homepage-menu-icon"
                />
                <h1 className="customer-homepage-header-title">AutoCare Connect</h1>
                <Logout />
            </header>

            {/* Main Content */}
            <div className="customer-homepage-main">
                {/* User Box */}
                <div className="customer-homepage-user-box">
                    <span>{customer.username || 'Loading...'}</span>
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
                        <InputText id="email" value={customer.email || 'Loading...'} readOnly />
                        <label htmlFor="phone">Phone:</label>
                        <InputText id="phone" value={customer.phone || 'Loading...'} readOnly />
                        <div className="customer-homepage-action-buttons">
                            <Button label="Change Email" className="customer-homepage-action-button" onClick={toEmailPage}/>
                            <Button label="Change Phone Number" className="customer-homepage-action-button" onClick={toPhonePage} />
                            <Button label="Change Password" className="customer-homepage-action-button" onClick={toPasswordPage}/>
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
                    <Button label="Repair Information" className="p-button-rounded customer-homepage-action-button" onClick={toRepairInfo}/>
                    <Button label="My Rewards" className="p-button-rounded customer-homepage-action-button" onClick={toRewardsPage}/>
                </section>
            </div>


            {/* Footer */}
            <footer className="customer-homepage-footer">
                <div className="customer-homepage-footer-text">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="customer-homepage-footer-logo" />
            </footer>
        </div>
    );
};

export default CustomerHomepage;
