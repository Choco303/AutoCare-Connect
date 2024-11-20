import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/mechanicHomepage.css';

const MechHomepage = () => {
    const navigate = useNavigate();
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
        navigate('/');
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
                    <p><strong>Customer:</strong> John Smith</p>
                    <p><strong>Contact Info:</strong> john.smith@gmail.com</p>
                    <p><strong>Task Name:</strong> Oil Change</p>
                    <p><strong>Status:</strong> In Progress</p>
                </div>

                <div className="resources">
                    <h3>Resources</h3>
                    <p><strong>Parts:</strong> Oil Filter (x1)</p>
                    <p><strong>Materials:</strong> Oil (1 qt)</p>
                </div>

                <div className="upcoming-tasks">
                    <h3>Upcoming Tasks</h3>
                    <p><strong>Nissan Versa 2007</strong> - Oil Change & Wheel Alignment</p>
                    <p><strong>Chevrolet Camaro 1983</strong> - Spark Plug Replacement</p>
                </div>

                <div className="current-task">
                    <h3>Current Task</h3>
                    <p><strong>Status:</strong> {taskStatus}</p>
                    <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                        <option value="Start Repair">Start Repair</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="button-row">
                        <button onClick={handleStartTime}>Start Time</button>
                        <button onClick={handleEndTime}>End Time</button>
                    </div>
                    <p>{startTime ? `Started at: ${startTime}` : 'Time not started'}</p>
                    <p>{endTime ? `Ended at: ${endTime}` : 'Time not ended'}</p>
                </div>
            </div>
            {/* Footer */}
            <footer className="home-page-footer-banner">
                <div className="home-page-footer-description">Providing quality car management services for your convenience.</div>
                <img src={require('./images/logo.png')} alt="Logo" className="home-page-footer-logo" />
            </footer>
        </div>
    );
};

export default MechHomepage;
