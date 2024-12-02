import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/adminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // admin, similar functions to the other login pages
    useEffect(() => {
        if (localStorage.getItem('adminUsername')) {
            navigate('/adminHomepage');
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
            const response = await axios.post('http://localhost:8080/api/admin/login', { username, password });
            localStorage.setItem('adminUsername', response.data); // Store admin username in localStorage
            setLoginMessage('Login successful!');
            setIsError(false);

            navigate('/adminHomepage');
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
        <div className="admin-login-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="admin-login-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="admin-login-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="admin-login-banner-title">AutoCare Connect</h1>
            </div>

            {/* Login Form */}
            <div className="admin-login-container">
                <img src={require('./images/logo.png')} alt="Logo" className="admin-login-logo" />
                <h1 className="admin-login-title">Admin</h1>
                <form onSubmit={handleSubmit}>
                    <div className="admin-login-field">
                        <span className="admin-login-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}  //Prompts User to enter there Username
                                required
                            />
                            <label htmlFor="username">Username</label>  
                        </span>
                    </div>
                    <div className="admin-login-field">
                        <span className="admin-login-float-label">
                            <InputText
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}   //Prompts User to enter there password
                                required
                            />
                            <label htmlFor="password">Password</label>    
                        </span>
                        <Button label={showPassword ? 'Hide Password' : 'Show Password'} className="toggle-password-button" onClick={togglePasswordVisibility} type="button"/>
                    </div>
                    <Button label="Login" type="submit" className="admin-login-button" />
                </form>

                {/* Display Login Message */}
                {loginMessage && (
                    <p className={isError ? 'admin-login-error-message' : 'admin-login-success-message'}>
                        {loginMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
