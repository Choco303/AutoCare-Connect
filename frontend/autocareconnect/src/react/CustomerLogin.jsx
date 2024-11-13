import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import './css/CustomerLogin.css';

const CustomerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        <div className="login-page">
            <h2>Customer Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="username">Username</label>
                    </span>
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="password">Password</label>
                    </span>
                </div>
                <Button label="Login" type="submit" />
            </form>
        </div>
    );
};

export default CustomerLogin;
