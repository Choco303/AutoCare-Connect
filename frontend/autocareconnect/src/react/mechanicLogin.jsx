import React, { useState, useEffect } from 'react'; // Importing React hooks
import Sidebar from './sidebar'; // Importing Sidebar component
import { InputText } from 'primereact/inputtext'; // Importing InputText component from PrimeReact
import { Button } from 'primereact/button'; // Importing Button component from PrimeReact
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for routing
import axios from 'axios'; // Importing axios for making HTTP requests
import './css/base.css'; // Importing base CSS for styling
import './css/mechanicLogin.css'; // Importing specific CSS for mechanic login page styling

const MechanicLogin = () => {
    // State hooks to manage form input values, UI states, and error handling
    const [username, setUsername] = useState(''); // Stores the username input value
    const [password, setPassword] = useState(''); // Stores the password input value
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate(); // Use navigate hook for programmatic navigation

    // useEffect hook to check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('mechanicUsername')) { // If the mechanic username exists in local storage
            navigate('/mechanicHomepage');
        }
    }, [navigate]);

    // Function to toggle the visibility of the password
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Function to toggle the sidebar open/closed
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    // Handles the form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        // Basic validation to ensure both username and password are provided
        if (!username || !password) {
            setLoginMessage('Please fill out all fields.'); // Sets message if fields are empty
            setIsError(true); // Marks it as an error
            return; // Stops further execution if fields are empty
        }

        try {
            // Making a POST request to login API with username and password
            const response = await axios.post('http://localhost:8080/api/mechanic/login', { username, password });
            localStorage.setItem('mechanicUsername', response.data); // Save username to localStorage if login is successful
            setLoginMessage('Login successful!');
            setIsError(false);
            navigate('/mechanicHomepage'); // Redirect to the mechanic homepage after successful login
        } catch (error) {
            // Handle errors from the API request
            if (error.response && error.response.status === 401) {
                setLoginMessage('Username or Password is incorrect. Please try again.'); // Invalid credentials
            } else {
                setLoginMessage('An unexpected error occurred. Please try again later.');
            }
            setIsError(true);
        }
    };

    return (
        <div className="mechanic-login-page-container">
            {/* Sidebar component with conditional rendering based on isSidebarOpen state */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header Banner with a menu icon that toggles the sidebar */}
            <div className="mechanic-login-header-banner">
                {/* Menu icon that triggers the toggleSidebar function when clicked */}
                <img
                    src={require('./images/menu.png')}
                    alt="Menu Icon"
                    className="mechanic-login-menu-icon"
                    onClick={toggleSidebar}
                />
                <h1 className="mechanic-login-banner-title">AutoCare Connect</h1>
            </div>

            {/* Main container for the login form */}
            <div className="mechanic-login-container">
                {/* Logo image */}
                <img src={require('./images/logo.png')} alt="Logo" className="mechanic-login-logo" />
                <h1 className="mechanic-login-title">Mechanic</h1>
                {/* Form for submitting login details */}
                <form onSubmit={handleSubmit}>
                    {/* Username input field */}
                    <div className="mechanic-login-field">
                        <span className="mechanic-login-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} // Updates the username state when the input changes
                                required // Makes this field mandatory
                            />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>

                    {/* Password input field with the option to toggle visibility */}
                    <div className="mechanic-login-field">
                        <span className="mechanic-login-float-label">
                            <InputText
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required // Makes this field mandatory
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                        {/* Button to toggle password visibility */}
                        <Button label={showPassword ? 'Hide Password' : 'Show Password'} className="toggle-password-button" onClick={togglePasswordVisibility} type="button"/>
                    </div>

                    {/* Login button */}
                    <Button label="Login" type="submit" className="mechanic-login-button" />
                </form>

                {/* Display login success or error message */}
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
