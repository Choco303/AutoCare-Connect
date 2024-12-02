import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from './sidebar';
import Logout from "./logout";
import './css/changeNumber.css';

const ChangeNumberPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newNumber, setNewNumber] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // function to format the number
    const formatPhoneNumber = (value) => {
        const numericValue = value.replace(/\D/g, '');

        // Format to (XXX) XXX-XXXX
        if (numericValue.length <= 3) {
            return `(${numericValue}`;
        } else if (numericValue.length <= 6) {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        } else {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
        }
    };

    const handleInputChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setNewNumber(formattedValue);
    };

    const handleNumberChange = () => {
        if (!newNumber || newNumber.length < 14) {
            setMessage("Please provide a valid phone number.");
            setMessageType('error');
            return;
        }

        const username = localStorage.getItem('customerUsername');
        axios
            .put(`http://localhost:8080/api/customer/update-number`, null, {
                params: { username, newNumber },
            })
            .then(() => {
                setMessage("Phone number updated successfully!");
                setMessageType('success');
                setNewNumber('');
            })
            .catch((error) => {
                console.error('Error updating number:', error);
                setMessage("Failed to update phone number. Please try again.");
                setMessageType('error');
            });
    };

    const goBackToProfile = () => {
        navigate('/customerHomepage');
    };

    return (
        <div className="Change-Number-Page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="Change-Number-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="Change-Number-menu-icon"
                />
                <h1 className="Change-Number-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="Change-Number-content-wrapper">
                <h2 className="Change-Number-title">Change Phone Number</h2>
                <div className="Change-Number-form-container">
                    <div className="Change-Number-form-group">
                        <label htmlFor="new-number">New Phone Number:</label>
                        <input
                            type="text"
                            id="new-number"
                            value={newNumber}
                            onChange={handleInputChange}
                            className="Change-Number-Page-input"
                            maxLength="14" // Limit input to (XXX) XXX-XXXX
                        />
                    </div>

                    <div className="Change-Number-buttons">
                        <button
                            className="Change-Number-backButton"
                            onClick={goBackToProfile}>
                            Back
                        </button>
                        <button
                            className="Change-Number-Page-changeButton"
                            onClick={handleNumberChange}>
                            Change
                        </button>
                    </div>

                    {/* Display feedback message below the buttons */}
                    {message && (
                        <p
                            className={`Change-Number-message ${
                                messageType === 'success'
                                    ? 'Change-Number-message-success'
                                    : 'Change-Number-message-error'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>

            <footer className="Change-Number-footer-banner">
                <div className="Change-Number-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img
                    src={require('./images/logo.png')}
                    alt="Logo"
                    className="Change-Number-footer-logo"
                />
            </footer>
        </div>
    );
};

export default ChangeNumberPage;
