import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from './sidebar'; // Adjust the path if necessary
import Logout from "./logout"; // Adjust the path if necessary
import './css/changePassword.css';

const ChangePasswordPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Toggle visibility for all passwords
    const [message, setMessage] = useState(''); // Feedback message
    const [messageType, setMessageType] = useState(''); // Success or error
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handlePasswordChange = () => {
        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setMessage("New password and confirmation do not match.");
                setMessageType('error');
                return;
            }

            const username = localStorage.getItem('customerUsername');
            axios
                .put(`http://localhost:8080/api/customer/update-password`, null, {
                    params: { username, newPassword },
                })
                .then(() => {
                    setMessage("Password updated successfully!");
                    setMessageType('success');
                    setNewPassword('');
                    setConfirmPassword('');
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    setMessage("Failed to update password. Please try again.");
                    setMessageType('error');
                });
        } else {
            setMessage("Please fill in all fields.");
            setMessageType('error');
        }
    };

    const goBackToProfile = () => {
        navigate('/customerHomepage');
    };

    return (
        <div className="Change-Password-Page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="Change-Password-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="Change-Password-menu-icon"
                />
                <h1 className="Change-Password-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="Change-Password-content-wrapper">
                <h2 className="Change-Password-title">Change Password</h2>
                <div className="Change-Password-form-container">
                    <div className="Change-Password-form-group">
                        <label htmlFor="current-password">Current Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="current-password"
                            value={currentPassword || ''}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="Change-Password-Page-input"
                        />
                    </div>
                    <div className="Change-Password-form-group">
                        <label htmlFor="new-password">New Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="Change-Password-Page-input"
                        />
                    </div>
                    <div className="Change-Password-form-group">
                        <label htmlFor="confirm-password">Confirm New Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="Change-Password-Page-input"
                        />
                    </div>

                    <div className="Change-Password-buttons">
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="toggle-password-button">
                            {showPassword ? 'Hide All' : 'Show All'}
                        </button>
                        <button
                            className="Change-Password-backButton"
                            onClick={goBackToProfile}>
                            Back
                        </button>
                        <button
                            className="Change-Password-Page-changeButton"
                            onClick={handlePasswordChange}>
                            Change
                        </button>
                    </div>

                    {/* Display feedback message below the buttons */}
                    {message && (
                        <p
                            className={`Change-Password-message ${
                                messageType === 'success'
                                    ? 'Change-Password-message-success'
                                    : 'Change-Password-message-error'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>

            <footer className="Change-Password-footer-banner">
                <div className="Change-Password-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img
                    src={require('./images/logo.png')}
                    alt="Logo"
                    className="Change-Password-footer-logo"
                />
            </footer>
        </div>
    );
};

export default ChangePasswordPage;
