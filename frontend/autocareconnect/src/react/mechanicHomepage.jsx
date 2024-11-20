import React, { useState } from 'react';
import './css/mechanicHomepage.css';

const MechanicHomepage = () => {
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
        alert('Back button clicked!');
    };

    return (
        <div className="mechanic-homepage-container">
            <div className="mechanic-homepage-header">
                <button onClick={handleBack} className="mechanic-homepage-back-btn">⬅ Back</button>
                <button className="mechanic-homepage-profile-btn">Mechanic's Profile</button>
                <button onClick={handleClockInOut} className="mechanic-homepage-clock-btn">
                    {clockedIn ? 'Clock-out' : 'Clock-in'}
                </button>
                <button className="mechanic-homepage-logout-btn">Logout</button>
            </div>

            <div className="mechanic-homepage-task-section">
                <div className="mechanic-homepage-assigned-tasks">
                    <h3>Assigned Tasks</h3>
                    <p>Customer: John Smith</p>
                    <p>Contact Info: john.smith@gmail.com</p>
                    <p>Task Name: Oil Change</p>
                    <p>Status: {taskStatus}</p>
                </div>

                <div className="mechanic-homepage-resources">
                    <h3>Resources</h3>
                    <p>Parts: Oil Filter (x1)</p>
                    <p>Materials: Oil (1 qt)</p>
                </div>

                <div className="mechanic-homepage-upcoming-tasks">
                    <h3>Upcoming Tasks</h3>
                    <p>Nissan Versa 2007 - Oil Change & Wheel Alignment</p>
                    <p>Chevrolet Camaro 1983 - Spark Plug Replacement</p>
                </div>

                <div className="mechanic-homepage-current-task">
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

            <footer className="mechanic-homepage-footer-banner">
                <div className="mechanic-homepage-footer-description">Providing quality car management services for your convenience.</div>
                <img src={require('./images/logo.png')} alt="Logo" className="mechanic-homepage-footer-logo" />
            </footer>
        </div>
    );
};

export default MechanicHomepage;
