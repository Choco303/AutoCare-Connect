import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from './sidebar'; // Adjust the path if necessary
import Logout from "./logout"; // Adjust the path if necessary
import './css/changeEmail.css';

const ChangeEmailPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // Simulate fetching the logged-in user's email
        const loggedInUserEmail = 'John.Smith@email.com'; // Replace with actual email fetching logic if needed
        setCurrentEmail(loggedInUserEmail);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleEmailChange = () => {
        if (newEmail) {
            const username = localStorage.getItem('customerUsername');
            axios
                .put(`http://localhost:8080/api/customer/update-email`, null, {
                    params: { username, newEmail },
                })
                .then(() => {
                    axios
                        .get(`http://localhost:8080/api/customer/details/${username}`)
                        .then((response) => {
                            setCurrentEmail(response.data.email); // Update the current email state
                            setNewEmail(''); // Clear the input
                        })
                        .catch((error) => {
                            console.error('Error refetching customer details:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error updating email:', error);
                    alert('Failed to update email. Please try again.');
                });
        } else {
            alert('Please enter a new email address.');
        }
    };


    const goBackToProfile = () => {
        navigate('/customerHomepage');
    }

    useEffect(() => {
        const username = localStorage.getItem('customerUsername');
        if (username) {
            axios
                .get(`http://localhost:8080/api/customer/details/${username}`)
                .then((response) => {
                    setCurrentEmail(response.data.email); // Set current email dynamically
                })
                .catch((error) => {
                    console.error('Error fetching customer details:', error);
                });
        }
    }, []);

    return (
        <div className="Change-Email-Page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="Change-Email-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="Change-Email-menu-icon"
                />
                <h1 className="Change-Email-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="Change-Email-content-wrapper"> {/* New wrapper */}
                <h2 className="Change-Email-title">Change Email</h2>
                <div className="Change-Email-form-container">
                    <div className="Change-Email-form-group">
                        <label htmlFor="current-email">Current Email Address:</label>
                        <input
                            type="email"
                            id="current-email"
                            value={currentEmail || 'Loading...'}
                            readOnly
                            className="Change-Email-Page-input"
                        />
                    </div>
                    <div className="Change-Email-form-group">
                        <label htmlFor="new-email">New Email Address:</label>
                        <input
                            type="email"
                            id="new-email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="Change-Email-Page-input"
                        />
                    </div>
                    <div className="Change-Email-buttons">
                        <button
                            className="Change-Email-backButton"
                            onClick={goBackToProfile}>
                            Back
                        </button>
                        <button
                            className="Change-Email-Page-changeButton"
                            onClick={handleEmailChange}>
                            Change
                        </button>
                    </div>
                </div>
            </div>

            <footer className="Change-Email-footer-banner">
                <div className="Change-Email-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img
                    src={require('./images/logo.png')}
                    alt="Logo"
                    className="Change-Email-footer-logo"
                />
            </footer>
        </div>
    );
};

export default ChangeEmailPage;
