import React, { useState } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/registrationPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!email || !confirmEmail || !password || !confirmPassword) {
            setMessage('All fields are required.');
            setIsError(true);
            return;
        }

        if (email !== confirmEmail) {
            setMessage('Emails do not match.');
            setIsError(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsError(true);
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/register', {
                email,
                password,
            });

            setMessage('Registration successful!');
            setIsError(false);

            // Navigate to login page
            navigate('/customerLogin');
        } catch (error) {
            setMessage('An error occurred during registration. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="register-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="register-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="banner-title">AutoCare Connect</h1>
            </div>

            {/* Registration Form */}
            <div className="register-container">
                <img src={require('./images/logo.png')} alt="Logo" className="register-logo" />
                <h1 className="register-title">Registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Email</label>
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="confirmEmail"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                            />
                            <label htmlFor="confirmEmail">Confirm Email</label>
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </span>
                    </div>
                    <Button label="Register" type="submit" className="register-button" />
                </form>

                {/* Display Message */}
                {message && (
                    <p className={isError ? 'register-error-message' : 'register-success-message'}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
