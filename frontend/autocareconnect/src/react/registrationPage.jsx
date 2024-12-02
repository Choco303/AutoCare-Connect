import React, { useState } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/registrationPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toLoginPage = () => {
        navigate('/login');
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const formatPhone = (value) => {
        const numericValue = value.replace(/\D/g, '');

        // format to (XXX) XXX-XXXX
        if (numericValue.length <= 3) {
            return `(${numericValue}`;
        } else if (numericValue.length <= 6) {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        } else {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
        }
    };

    const handlePhoneChange = (e) => {
        const formattedValue = formatPhone(e.target.value);
        setPhone(formattedValue);
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

        if (!phone || phone.length < 14) { // 14 ensures full (XXX) XXX-XXXX format
            setMessage('Please provide a valid phone number.');
            setIsError(true);
            return;
        }


        try {
            await axios.post('http://localhost:8080/api/customer/register', {
                username,
                email,
                password,
                phone,
            });

            setMessage('Registration successful!');
            setIsError(false);

            // Navigate to login page
            navigate('/Login');
        } catch (error) {
            setMessage(
                error.response?.data || 'An error occurred during registration. Please try again.'
            );
            setIsError(true);
        }
    };

    return (
        <div className="register-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="register-header-banner">
                <img
                    src={require('./images/menu.png')}   //Allows for User to access sidebar
                    alt="Menu Icon"
                    className="register-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="register-banner-title">AutoCare Connect</h1>
            </div>

            {/* Registration Form */}
            <div className="register-container">
                <img src={require('./images/logo.png')} alt="Logo" className="register-logo" />
                <h1 className="register-title">Registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}  //Prompts the User to create a Username
                            />
                            <label htmlFor="username">Username</label>  
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} //Prompts the User for there email
                            />
                            <label htmlFor="email">Email</label>
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="confirmEmail"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)} //Prompts user to enter email twice to ensure consistency
                            />
                            <label htmlFor="confirmEmail">Confirm Email</label>  
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}  //Prompts user to enter there password
                            />
                            <label htmlFor="password">Password</label> 
                        </span>
                        {/* Allows for usage of hide and show passowrd button */}
                        <Button label={showPassword ? 'Hide Password' : 'Show Password'} className="toggle-password-button" onClick={togglePasswordVisibility} type="button"/> 
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}  //Prompts user to enter there password a 2nd time identical to the first entry
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </span>
                    </div>
                    <div className="register-field">
                        <span className="register-float-label">
                            <InputText
                                id="phone"
                                type="phone"
                                value={phone}
                                maxLength="14"
                                onChange={handlePhoneChange} //Prompts user to enter there phone number
                            />
                            <label htmlFor="phone">Phone Number</label>  
                        </span>
                    </div>
                    <Button label="Register" type="submit" className="register-button"/>
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
