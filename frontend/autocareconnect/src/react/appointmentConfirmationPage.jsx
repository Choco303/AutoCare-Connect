import React, { useState, useEffect } from 'react';
import Sidebar from "./sidebar";
import Logout from "./logout";
import './css/appointmentConfirmationPage.css';
import axios from 'axios';

const AppointmentConfirmationPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        receiptId: "Loading...",
        serviceName: "Loading...",
        carMake: "Loading...",
        carModel: "Loading...",
        appointmentDate: "Loading...",
    });
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Retrieve the username from localStorage
        const loggedInUsername = localStorage.getItem('customerUsername');
        if (loggedInUsername) {
            setUsername(loggedInUsername);
            fetchAppointmentDetails(loggedInUsername);
        } else {
            setError("User is not logged in.");
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchAppointmentDetails = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointment/details/${username}`);
            if (response.data && !response.data.message) {
                setAppointmentDetails({
                    receiptId: response.data.receiptId || "No Receipt Found",
                    serviceName: response.data.serviceName || "N/A",
                    carMake: response.data.carMake || "N/A",
                    carModel: response.data.carModel || "N/A",
                    appointmentDate: response.data.appointmentDate
                        ? new Date(response.data.appointmentDate).toLocaleDateString()
                        : "N/A",
                });
            } else {
                setAppointmentDetails((prev) => ({
                    ...prev,
                    receiptId: "No Receipt Found",
                }));
            }
        } catch (err) {
            console.error("Error fetching appointment details:", err);
            setError("Failed to fetch appointment details. Please try again later.");
        }
    };

    return (
        <div className="appointment-confirmation-page-container">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header */}
            <header className="appointment-confirmation-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="appointment-confirmation-menu-icon"
                />
                <h1 className="appointment-confirmation-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            {/* Confirmation Content */}
            <main className="appointment-confirmation-container">
                {error ? (
                    <p className="appointment-confirmation-error">{error}</p>
                ) : (
                    <>
                        <h2 className="appointment-confirmation-title">Appointment has been booked!</h2>
                        <p className="appointment-confirmation-receipt">
                            Receipt: <span className="appointment-confirmation-receipt-id">{appointmentDetails.receiptId}</span>
                        </p>
                        <p className="appointment-confirmation-service">
                            Service: {appointmentDetails.serviceName}
                        </p>
                        <p className="appointment-confirmation-car">
                            Car: {appointmentDetails.carMake} {appointmentDetails.carModel}
                        </p>
                        <p className="appointment-confirmation-date">
                            Appointment Date: {appointmentDetails.appointmentDate}
                        </p>
                    </>
                )}
            </main>
        </div>
    );
};

export default AppointmentConfirmationPage;
