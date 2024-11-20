import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/base.css';
import './css/mechanicLogin.css'; // Change the CSS file to reflect mechanic login styles

const MechanicLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    // Redirect to mechanic homepage if already logged in
    useEffect(() => {
        if (localStorage.getItem('MechanicUsername')) {
            navigate('/MechHomepage'); // Update the page route
        }
    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if fields are empty
        if (!username || !password) {
            setLoginMessage('Please fill out all fields.');
            setIsError(true);
            return;
        }

        try {
            // Ensure the correct endpoint for mechanic login
            const response = await axios.post('http://localhost:8080/api/mechanic/login', { username, password }); // Change API endpoint
            localStorage.setItem('mechanicUsername', response.data); // Store mechanic username in localStorage
            setLoginMessage('Login successful!');
            setIsError(false);

            // Navigate to mechanic homepage after successful login
            navigate('/MechHomepage'); // Update the page route
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
        <div className="mechanic-login-page-container"> {/* Change container class name */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="mechanic-login-header-banner"> {/* Update the header class */}
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="mechanic-login-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="mechanic-login-banner-title">AutoCare Connect</h1>
            </div>

            {/* Login Form */}
            <div className="mechanic-login-container"> {/* Change container class */}
                <img src={require('./images/logo.png')} alt="Logo" className="mechanic-login-logo" /> {/* Change logo class */}
                <h1 className="mechanic-login-title">Mechanic</h1> {/* Update title */}
                <form onSubmit={handleSubmit}>
                    <div className="mechanic-login-field"> {/* Change field class */}
                        <span className="mechanic-login-float-label"> {/* Change float label class */}
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="mechanic-login-field"> {/* Change field class */}
                        <span className="mechanic-login-float-label"> {/* Change float label class */}
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <Button label="Login" type="submit" className="mechanic-login-button" /> {/* Change button class */}
                </form>

                {/* Display Login Message */}
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
