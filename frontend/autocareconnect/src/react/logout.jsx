import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/logout.css';

const Logout = () => {
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure localStorage values are consistent and clear any invalid state
        const resetUserState = () => {
            const customerUsername = localStorage.getItem('customerUsername');
            const adminUsername = localStorage.getItem('adminUsername');
            const mechanicUsername = localStorage.getItem('mechanicUsername');

            if (customerUsername) {
                setUsername(customerUsername);
                setRole('customer');
            } else if (adminUsername) {
                setUsername(adminUsername);
                setRole('admin');
            } else if (mechanicUsername) {
                setUsername(mechanicUsername);
                setRole('mechanic');
            } else {
                // Clear localStorage to avoid stale state
                localStorage.removeItem('customerUsername');
                localStorage.removeItem('adminUsername');
                localStorage.removeItem('mechanicUsername');
                setUsername(null);
                setRole(null);
            }
        };

        // Call the function on component mount
        resetUserState();

        // Handle clicks outside the dropdown to close it
        const handleClickOutside = (event) => {
            if (!event.target.closest('.logout-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        if (role === 'customer') {
            localStorage.removeItem('customerUsername');
        } else if (role === 'admin') {
            localStorage.removeItem('adminUsername');
        } else if (role === 'mechanic') {
            localStorage.removeItem('mechanicUsername');
        }

        setUsername(null);
        setRole(null);

        // Navigate to the home page and reload
        navigate('/');
        window.location.reload();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!username) return null;

    return (
        <div className="logout-container">
            <button className="username-button" onClick={toggleDropdown}>
                {username}
            </button>

            {isDropdownOpen && (
                <div className="logout-dropdown">
                    <ul className="logout-dropdown-menu">
                        <li className="logout-option" onClick={handleLogout}>Log Out</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Logout;
