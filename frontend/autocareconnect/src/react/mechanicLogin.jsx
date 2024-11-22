import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/mechanicLogin.css';

const MechanicLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('mechanicUsername')) {
            navigate('/mechanicHomepage');
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setLoginMessage('Please fill out all fields.');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/mechanic/login', { username, password });
            localStorage.setItem('mechanicUsername', response.data);
            setLoginMessage('Login successful!');
            setIsError(false);
            navigate('/mechanicHomepage');
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
        <div className="mechanic-login-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="mechanic-login-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="mechanic-login-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="mechanic-login-banner-title">AutoCare Connect</h1>
            </div>

            <div className="mechanic-login-container">
                <img src={require('./images/logo.png')} alt="Logo" className="mechanic-login-logo" />
                <h1 className="mechanic-login-title">Mechanic</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mechanic-login-field">
                        <span className="mechanic-login-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="mechanic-login-field">
                        <span className="mechanic-login-float-label">
                            <InputText
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                        <Button label={showPassword ? 'Hide Password' : 'Show Password'} className="toggle-password-button" onClick={togglePasswordVisibility} type="button"/>
                    </div>
                    <Button label="Login" type="submit" className="mechanic-login-button" />
                </form>

                {loginMessage && (
                    <p className={isError ? 'mechanic-login-error-message' : 'mechanic-login-success-message'}>
                        {loginMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MechanicLogin;
