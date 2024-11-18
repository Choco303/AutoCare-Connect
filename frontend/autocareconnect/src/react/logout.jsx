import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/logout.css';

const Logout = () => {
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the logged-in username and role from localStorage
        const customerUsername = localStorage.getItem('customerUsername');
        const adminUsername = localStorage.getItem('adminUsername');

        if (customerUsername) {
            setUsername(customerUsername);
            setRole('customer');
        } else if (adminUsername) {
            setUsername(adminUsername);
            setRole('admin');
        }

        // Close dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.logout-container')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Clear login state
        if (role === 'customer') {
            localStorage.removeItem('customerUsername');
        } else if (role === 'admin') {
            localStorage.removeItem('adminUsername');
        }

        setUsername(null);
        setRole(null);
        navigate('/'); // Redirect to the home page
        window.location.reload(); // refresh the page
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // dropdown visibility
    };

    if (!username) {
        return null; // do not display if logged in
    }

    return (
        <div className="logout-container">
            {/* Username as dropdown toggle button */}
            <button className="username-button" onClick={toggleDropdown}>
                {username}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="logout-dropdown">
                    <ul className="logout-dropdown-menu">
                        <li onClick={() => navigate('/settings')}>Settings</li>
                        <li className="logout-option" onClick={handleLogout}>Log Out</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Logout;
