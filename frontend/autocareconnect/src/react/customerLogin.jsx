import React, { useState } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css'
import './css/customerLogin.css';

const CustomerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', { username, password });
            setLoginMessage(response.data);
            setIsError(false);

            // Navigate to profile page if login is successful
            if (response.data === "Login successful!") {
                navigate('/customerProfile');
            }
        } catch (error) {
            console.error('Error logging in', error);
            setLoginMessage('Login failed. Please check your username and password.');
            setIsError(true);
        }
    };

    return (
        <div className="customer-login-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="customer-login-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="customer-login-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="customer-login-banner-title">AutoCare Connect</h1>
            </div>

            {/* Login Form */}
            <div className="customer-login-container">
                <img src={require('./images/logo.png')} alt="Logo" className="customer-login-logo" />
                <form onSubmit={handleSubmit}>
                    <div className="customer-login-field">
                        <span className="customer-login-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="customer-login-field">
                        <span className="customer-login-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <Button label="Login" type="submit" className="customer-login-button" />
                    <Button label="Register New Account" className="customer-login-register-button" />
                </form>

                {/* Display Login Message */}
                {loginMessage && (
                    <p className={isError ? 'customer-login-error-message' : 'customer-login-success-message'}>
                        {loginMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomerLogin;
