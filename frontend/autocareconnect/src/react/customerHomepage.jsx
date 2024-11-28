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
    const [appointment, setAppointment] = useState({
        receiptId: 'None',
        serviceName: 'None',
        carMake: 'None',
        carModel: '',
        carYear: '',
        appointmentDate: 'None',
    });
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

    const toAppointmentPage = () => {
        navigate('/vehicle');
    }
    useEffect(() => {
        const username = localStorage.getItem('customerUsername');
        if (username) {
            // Fetch customer details
            axios
                .get(`http://localhost:8080/api/customer/details/${username}`)
                .then((response) => {
                    setCustomer({
                        username: response.data.username || 'N/A',
                        email: response.data.email || 'N/A',
                        phone: response.data.phone || 'N/A',
                    });
                })
                .catch((error) => {
                    console.error('Error fetching customer details:', error);
                    setCustomer({
                        username: 'Error fetching username',
                        email: 'Error fetching email',
                        phone: 'Error fetching phone',
                    });
                });

            // Fetch appointment details
            axios
                .get(`http://localhost:8080/api/appointment/details/${username}`)
                .then((response) => {
                    if (response.data && !response.data.message) {
                        setAppointment({
                            receiptId: response.data.receiptId || 'No Receipt Found',
                            serviceName: response.data.serviceName || 'None',
                            carMake: response.data.carMake || 'None',
                            carModel: response.data.carModel || 'None',
                            carYear: response.data.carYear || 'None',
                            appointmentDate: response.data.appointmentDate || 'None',
                            status: response.data.status || 'None',
                        });
                    } else {
                        setAppointment((prev) => ({
                            ...prev,
                            receiptId: 'No Receipt Found',
                            status: 'None',
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching appointment details:', error);
                    setAppointment((prev) => ({
                        ...prev,
                        receiptId: 'Error retrieving receipt',
                        status: 'None',
                    }));
                });
        }
    }, []);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Converts to 12-hour format
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };


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
                        <InputText id="service" value={appointment.serviceName} readOnly/>
                        <label htmlFor="car">Car:</label>
                        <InputText
                            id="car"
                            value={
                                appointment.carMake === 'None' &&
                                appointment.carModel === 'None' &&
                                appointment.carYear === 'None'
                                    ? 'None'
                                    : `${appointment.carMake} ${appointment.carModel} ${appointment.carYear}`
                            }
                            readOnly
                        />
                        <label htmlFor="appointment">Appointment Date:</label>
                        <InputText
                            id="appointment"
                            value={
                                appointment.appointmentDate !== 'None'
                                    ? formatDateTime(appointment.appointmentDate)
                                    : 'None'
                            }
                            readOnly
                        />
                        <label htmlFor="completion">Task Status:</label>
                        <InputText id="completion" value={appointment.status} readOnly/>
                    </div>

                    {/* Contact Box */}
                    <div className="customer-homepage-box customer-homepage-contact-box">
                        <label htmlFor="email">Email:</label>
                        <InputText id="email" value={customer.email || 'Loading...'} readOnly/>
                        <label htmlFor="phone">Phone:</label>
                        <InputText id="phone" value={customer.phone || 'Loading...'} readOnly/>
                        <div className="customer-homepage-action-buttons">
                            <Button label="Change Email" className="customer-homepage-action-button"
                                    onClick={toEmailPage}/>
                            <Button label="Change Phone Number" className="customer-homepage-action-button"
                                    onClick={toPhonePage}/>
                            <Button label="Change Password" className="customer-homepage-action-button"
                                    onClick={toPasswordPage}/>
                        </div>
                    </div>

                    {/* Receipt Box */}
                    <div className="customer-homepage-box customer-homepage-receipt-box">
                        <label>Receipt:</label>
                        <p>ID: {appointment.receiptId}</p>
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="customer-homepage-action-buttons">
                    <Button label="Appointment" className="p-button-rounded customer-homepage-action-button"
                            onClick={toAppointmentPage}/>
                    <Button label="Repair Information" className="p-button-rounded customer-homepage-action-button"
                            onClick={toRepairInfo}/>
                    <Button label="My Rewards" className="p-button-rounded customer-homepage-action-button"
                            onClick={toRewardsPage}/>
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
