import React, { useState } from 'react';
import './css/mechanicHomepage.css';

const MechHomepage = () => {
    const [taskStatus, setTaskStatus] = useState('In Progress');
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const handleClockInOut = () => {
        setClockedIn(!clockedIn);
    };

    const handleStartTime = () => {
        setStartTime(new Date().toLocaleTimeString());
    };

    const handleEndTime = () => {
        setEndTime(new Date().toLocaleTimeString());
    };

    const handleBack = () => {
        // Logic to go back to the previous page
        alert('Back button clicked!'); // Replace with actual navigation logic
    };

    return (
        <div className="mechanic-info-screen">
            <div className="header">
                <button onClick={handleBack} className="back-btn">⬅ Back</button>
                <button className="profile-btn">Mechanic's Profile</button>
                <button onClick={handleClockInOut} className="clock-btn">
                    {clockedIn ? 'Clock-out' : 'Clock-in'}
                </button>
                <button className="logout-btn">Logout</button>
            </div>

            <div className="task-section">
                <div className="assigned-tasks">
                    <h3>Assigned Tasks</h3>
                    <p>Customer: John Smith</p>
                    <p>Contact Info: john.smith@gmail.com</p>
                    <p>Task Name: Oil Change</p>
                    <p>Status: {taskStatus}</p>
                </div>

                <div className="resources">
                    <h3>Resources</h3>
                    <p>Parts: Oil Filter (x1)</p>
                    <p>Materials: Oil (1 qt)</p>
                </div>

                <div className="upcoming-tasks">
                    <h3>Upcoming Tasks</h3>
                    <p>Nissan Versa 2007 - Oil Change & Wheel Alignment</p>
                    <p>Chevrolet Camaro 1983 - Spark Plug Replacement</p>
                </div>

                <div className="current-task">
                    <h3>Current Task</h3>
                    <p>Status: {taskStatus}</p>
                    <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                        <option value="Start Repair">Start Repair</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button onClick={handleStartTime}>Start Time</button>
                    <button onClick={handleEndTime}>End Time</button>
                    <p>{startTime ? `Started at: ${startTime}` : 'Time not started'}</p>
                    <p>{endTime ? `Ended at: ${endTime}` : 'Time not ended'}</p>
                </div>
            </div>
            {/* Footer */}
            <footer className="footer-banner">
                <div className="footer-description">Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo"/>
            </footer>
        </div>
    );
};

export default MechHomepage;
