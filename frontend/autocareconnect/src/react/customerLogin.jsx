import React, { useState } from 'react';
import Sidebar from './sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import './css/customerLogin.css';

const CustomerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/login', { username, password });
            alert('Login successful!');
        } catch (error) {
            console.error('Error logging in', error);
            alert('Login failed.');
        }
    };

    return (
        <div className="customer-login-page">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Bar */}
            <div className="header-banner">
                <img src={require("./images/menu.png")} alt="Menu Icon" className="menu-icon" onClick={toggleSidebar}/>
                <h1 className="banner-title">Customer Login</h1>
            </div>

            {/* Login Form */}
            <div className="login-container">
                <img src={require("./images/logo.png")} alt="Logo" className="logo"/>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <span className="p-float-label">
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <InputText id="password" type="password" value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    <Button label="Login" type="submit" className="login-button"/>
                    <Button label="Register New Account" className="register-button"/>
                </form>
            </div>
        </div>
    );
};

export default CustomerLogin;
