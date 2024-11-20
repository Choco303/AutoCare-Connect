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
        <div className="mech-homepage">
            <div className="mech-header">
                <button onClick={handleBack} className="mech-back-btn">⬅ Back</button>
                <button className="mech-profile-btn">Mechanic's Profile</button>
                <button onClick={handleClockInOut} className="mech-clock-btn">
                    {clockedIn ? 'Clock-out' : 'Clock-in'}
                </button>
                <button className="mech-logout-btn">Logout</button>
            </div>

            <div className="mech-task-section">
                <div className="mech-assigned-tasks">
                    <h3>Assigned Tasks</h3>
                    <p><strong>Customer:</strong> John Smith</p>
                    <p><strong>Contact Info:</strong> john.smith@gmail.com</p>
                    <p><strong>Task Name:</strong> Oil Change</p>
                    <p><strong>Status:</strong> In Progress</p>
                </div>

                <div className="mech-resources">
                    <h3>Resources</h3>
                    <p><strong>Parts:</strong> Oil Filter (x1)</p>
                    <p><strong>Materials:</strong> Oil (1 qt)</p>
                </div>

                <div className="mech-upcoming-tasks">
                    <h3>Upcoming Tasks</h3>
                    <p><strong>Nissan Versa 2007</strong> - Oil Change & Wheel Alignment</p>
                    <p><strong>Chevrolet Camaro 1983</strong> - Spark Plug Replacement</p>
                </div>

                <div className="mech-current-task">
                    <h3>Current Task</h3>
                    <p><strong>Status:</strong> {taskStatus}</p>
                    <select
                        className="mech-select"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                    >
                        <option value="Start Repair">Start Repair</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="mech-button-row">
                        <button onClick={handleStartTime} className="mech-button">Start Time</button>
                        <button onClick={handleEndTime} className="mech-button">End Time</button>
                    </div>
                    <p>{startTime ? `Started at: ${startTime}` : 'Time not started'}</p>
                    <p>{endTime ? `Ended at: ${endTime}` : 'Time not ended'}</p>
                </div>
            </div>
            <footer className="mech-footer">
                <p>Providing quality car management services for your convenience.</p>
                <div className="mech-footer-logo">
                    <img src={require('./images/logo.png')} alt="Logo" />
                </div>
            </footer>
        </div>
    );
};

export default MechHomepage;
