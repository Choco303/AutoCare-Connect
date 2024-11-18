import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/logout.css';

const Logout = () => {
    const [username, setUsername] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the logged-in username from localStorage
        const storedUsername = localStorage.getItem('customerUsername');
        if (storedUsername) {
            setUsername(storedUsername);
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
        localStorage.removeItem('customerUsername'); // Clear login state
        setUsername(null);
        navigate('/'); // Redirect to the home page
        window.location.reload(); // Refresh the page to ensure session is cleared
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    if (!username) {
        return null; // Don't display if no user is logged in
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
