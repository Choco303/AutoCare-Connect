import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Sidebar from './sidebar'; // Sidebar component import
import './css/changeEmailPage.css'; // Custom CSS for the Change Email page

const ChangeEmailPage = () => {
    // State hooks for managing sidebar state, current email, and new email
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('John.Smith@email.com');
    const [newEmail, setNewEmail] = useState('');

    // Function to toggle the sidebar open/closed
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to handle email change logic
    const handleEmailChange = () => {
        // Check if the new email input is not empty
        if (newEmail) {
            alert(`Email changed to: ${newEmail}`); // Alert the user with the new email
            setCurrentEmail(newEmail); // Update the current email with the new one
            setNewEmail(''); // Clear the new email input field
        } else {
            alert('Please enter a new email address.'); // Alert if no new email is provided
        }
    };

    return (
        <div className="changeEmailPage-container">
            {/* Sidebar component with open/close functionality */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header section with a menu icon to toggle the sidebar */}
            <header className="header-banner">
                <img
                    src={require('./images/menu.png')} // Menu icon image
                    alt="Menu"
                    onClick={toggleSidebar} // Toggle sidebar on click
                    className="menu-icon"
                />
                <h1 className="banner-title">AutoCare Connect</h1> {/* Page title */}
            </header>

            {/* Title for the Change Email section */}
            <h2 className="title">Change Email</h2>

            {/* Form container for the change email input fields */}
            <div className="form-container">
                {/* Current email input field (read-only) */}
                <div className="form-group">
                    <label htmlFor="current-email">Current Email Address:</label>
                    <input
                        type="email"
                        id="current-email"
                        value={currentEmail} // Display the current email
                        readOnly // Make the field read-only
                        className="changeEmailPage-input" // Apply custom CSS class
                    />
                </div>

                {/* New email input field (editable) */}
                <div className="form-group">
                    <label htmlFor="new-email">New Email Address:</label>
                    <input
                        type="email"
                        id="new-email"
                        value={newEmail} // Bind the value to the state
                        onChange={(e) => setNewEmail(e.target.value)} // Update state on input change
                        className="changeEmailPage-input" // Apply custom CSS class
                    />
                </div>

                {/* Button to trigger email change */}
                <Button
                    label="Change"
                    className="changeEmailPage-changeButton" // Apply custom CSS class
                    onClick={handleEmailChange} // Call the handleEmailChange function on click
                />
            </div>

            {/* Footer section */}
            <footer className="footer-banner">
                <div className="footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img
                    src={require('./images/logo.png')} // Footer logo image
                    alt="Logo"
                    className="footer-logo" // Apply custom CSS class
                />
            </footer>
        </div>
    );
};

export default ChangeEmailPage;
