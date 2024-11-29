import React, { useState } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/customerLogin.css';

const CustomerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // handle what happens when a customer has filled out everything and then press submit to login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/customer/login', { username, password });

            const { id, username: returnedUsername } = response.data;

            localStorage.setItem('customerId', id);
            localStorage.setItem('customerUsername', returnedUsername);

            setLoginMessage('Login successful!');
            setIsError(false);

            navigate('/customerHomepage');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoginMessage('Username or Password is incorrect. Please try again.');
            } else {
                setLoginMessage('An unexpected error occurred. Please try again later.');
            }
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
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                        <Button label={showPassword ? 'Hide Password' : 'Show Password'} className="toggle-password-button" onClick={togglePasswordVisibility} type="button"/>
                    </div>
                    <Button label="Login" type="submit" className="customer-login-button" />
                    <Button
                        label="Register New Account"
                        className="customer-login-register-button"
                        onClick={() => navigate('/registrationPage')} // Redirect to a registration page
                    />
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
