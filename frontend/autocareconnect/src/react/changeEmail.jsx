import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Adjust the path if necessary
import './css/changeEmail.css'; // Adjust the path if necessary

const ChangeEmailPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

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
            alert(`Email changed to: ${newEmail}`);
            setCurrentEmail(newEmail);
            setNewEmail('');
        } else {
            alert('Please enter a new email address.');
        }
    };

    return (
        <div className="changeEmailPage-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">AutoCare Connect</h1>
            </header>

            <div className="content-wrapper"> {/* New wrapper */}
                <h2 className="title">Change Email</h2>
                <div className="form-container">
                    <div className="form-group">
                        <label htmlFor="current-email">Current Email Address:</label>
                        <input
                            type="email"
                            id="current-email"
                            value={currentEmail}
                            readOnly
                            className="changeEmailPage-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-email">New Email Address:</label>
                        <input
                            type="email"
                            id="new-email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="changeEmailPage-input"
                        />
                    </div>
                    <button
                        className="changeEmailPage-changeButton"
                        onClick={handleEmailChange}
                    >
                        Change
                    </button>
                </div>
            </div>

            <footer className="footer-banner">
                <div className="footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img
                    src={require('./images/logo.png')}
                    alt="Logo"
                    className="footer-logo"
                />
            </footer>
        </div>
    );
};

export default ChangeEmailPage;
