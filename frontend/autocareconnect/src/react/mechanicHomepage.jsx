import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css';
import './css/mechanicHomepage.css';
import axios from 'axios';

const MechHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTiming, setIsTiming] = useState(false);

    const [isClockModalVisible, setIsClockModalVisible] = useState(false);
    const [clockModalStartTime, setClockModalStartTime] = useState(null);
    const [clockModalElapsedTime, setClockModalElapsedTime] = useState(0);
    const [isClockModalTiming, setIsClockModalTiming] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows] = useState(5);

    const [receipts, setReceipts] = useState([]);

    // get the receipts from the database and backend
    useEffect(() => {
        const fetchReceipts = async () => {
            const mechanicUsername = localStorage.getItem('mechanicUsername'); // Retrieve from localStorage
            try {
                const response = await axios.get(`http://localhost:8080/api/receipts/byMechanic`, {
                    params: { username: mechanicUsername },
                });
                setReceipts(response.data);
            } catch (error) {
                console.error('Error fetching receipts:', error);
            }
        };

        fetchReceipts();
    }, []);


    useEffect(() => {
        console.log('Receipts state updated:', receipts);
    }, [receipts]);



    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // task timer
    const handleStartTask = () => {
        setStartTime(Date.now());
        setIsTiming(true);
    };

    const handleFinishTask = () => {
        setIsTiming(false);
        setElapsedTime(0);
    };

    // clock in timer
    const clockInTimer = () => {
        setClockModalStartTime(Date.now());
        setIsClockModalTiming(true);
    };

    const clockOutTimer = () => {
        setIsClockModalTiming(false);
        setClockModalElapsedTime(0);
    };

    // open table modal
    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    // open clock modal
    const openClockModal = () => {
        setIsClockModalVisible(true);
    };

    const closeClockModal = () => {
        setIsClockModalVisible(false);
    };

    const onPageChange = (e) => {
        setFirst(e.first);
    };

    useEffect(() => {
        let timer;
        if (isTiming) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isTiming, startTime]);

    useEffect(() => {
        let timer;
        if (isClockModalTiming) {
            timer = setInterval(() => {
                setClockModalElapsedTime(Math.floor((Date.now() - clockModalStartTime) / 1000));
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isClockModalTiming, clockModalStartTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mech-homepage-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="mech-page-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="mech-page-menu-icon"
                />
                <h1 className="mech-page-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="mech-task-section">
                <section className="mech-task-grid-section">
                    {/* Assigned Tasks */}
                    <div className="mech-assigned-tasks mech-homepage-box">
                        <label htmlFor="tasks">Assigned Tasks</label>
                        <label htmlFor="customer">Customer</label>
                        <InputText id="customer" value="someone" readOnly />
                        <label htmlFor="contact">Contact Info</label>
                        <InputText id="contact" value="john.smith@gmail.com" readOnly />
                        <label htmlFor="car">Car</label>
                        <InputText id="car" value="Toyota" readOnly />
                        <label htmlFor="taskName">Service</label>
                        <InputText id="taskName" value="Oil Change" readOnly />
                        <label htmlFor="time">Time</label>
                        <InputText id="time" value="45 minutes" readOnly />
                    </div>

                    {/* Resources */}
                    <div className="mech-resources mech-homepage-box">
                        <label htmlFor="resources">Resources</label>
                        <label htmlFor="parts">Parts</label>
                        <InputText id="parts" value="Oil Filter x1" readOnly />
                    </div>

                    {/* Shared Column for Current Task and Upcoming Tasks */}
                    <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
                        {/* Current Task */}
                        <div className="mech-current-task mech-homepage-box">
                            <label>Current Task:</label>
                            <p>
                                <strong>Status:</strong> {isTiming ? 'In Progress' : 'Not Started'}
                            </p>
                            <p>
                                <strong>Elapsed Time:</strong> {isTiming ? formatTime(elapsedTime) : '00:00'}
                            </p>
                            <div className="mech-button-row">
                                <Button
                                    label="Start Task"
                                    className="p-button-success mech-button"
                                    onClick={handleStartTask}
                                    disabled={isTiming}
                                />
                                <Button
                                    label="Finish"
                                    className="p-button-danger mech-button"
                                    onClick={handleFinishTask}
                                    disabled={!isTiming}
                                />
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="mech-upcoming-tasks mech-homepage-box">
                            <label htmlFor="upcoming">Upcoming Tasks</label>
                            <label htmlFor="task1">Nissan Versa 2007</label>
                            <InputText id="task1" value="Oil Change & Wheel Alignment" readOnly />
                            <label htmlFor="task2">Chevrolet Camaro 1983</label>
                            <InputText id="task2" value="Spark Plug Replacement" readOnly />
                        </div>
                    </div>

                    {/* Recently Completed Tasks */}
                    <div className="mech-recently-completed mech-homepage-box">
                        <label htmlFor="recentlyCompleted">Recently Completed Tasks</label>

                        {receipts.slice(0, 2).map((receipt, index) => (
                            <div className="mech-completed-task" key={index}>
                                <p><strong>Receipt:</strong> <span>{receipt.receiptId}</span></p>
                                <div className="mech-completed-task-details">
                                    <p><strong>Car:</strong> {receipt.carDetails}</p>
                                    <p><strong>Task:</strong> {receipt.task}</p>
                                    <p><strong>Date:</strong> {receipt.serviceDate}</p>
                                    <p><strong>Time Taken:</strong> {receipt.timeTaken}</p>
                                </div>
                            </div>
                        ))}
                        <Button
                            label="View Table"
                            className="p-button-secondary mech-button"
                            onClick={openModal}
                        />
                    </div>
                </section>
                {/* Clock In/Out Button */}
                <Button
                    label="Clock In/Out"
                    className="p-button-primary mech-button mech-clock-modal-button"
                    onClick={openClockModal}
                />
            </div>

            {/* Modal for Completed Tasks */}
            <Dialog
                header={<span className="mech-receipt-table-header">Recently Completed Task</span>}
                visible={isModalVisible}
                onHide={closeModal}
                className="mech-custom-modal"
            >
                <table className="mech-completed-tasks-table">
                    <thead>
                    <tr>
                        <th>Receipt</th>
                        <th>Car</th>
                        <th>Task</th>
                        <th>Date</th>
                        <th>Time Taken</th>
                    </tr>
                    </thead>
                    <tbody>
                    {receipts.slice(first, first + rows).map((receipt, index) => (
                        <tr key={index}>
                            <td>{receipt.receiptId}</td>
                            <td>{receipt.carDetails}</td>
                            <td>{receipt.task}</td>
                            <td>{receipt.serviceDate}</td>
                            <td>{receipt.timeTaken}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={receipts.length}
                    onPageChange={onPageChange}
                />
            </Dialog>

            {/* Modal for Clock In/Out */}
            <Dialog
                header={<span className="mech-clock-modal-header">Clock In/Out</span>}
                visible={isClockModalVisible}
                onHide={closeClockModal}
                className="mech-clock-modal"
            >
                <p>
                    <strong>Status:</strong> {isClockModalTiming ? 'Clocked In' : 'Clocked Out'}
                </p>
                <p className="mech-time-display">
                    {isClockModalTiming ? formatTime(clockModalElapsedTime) : '00:00'}
                </p>
                <div className="mech-button-row">
                    <Button
                        label="Clock In"
                        className="p-button-success mech-button"
                        onClick={clockInTimer}
                        disabled={isClockModalTiming}
                    />
                    <Button
                        label="Clock Out"
                        className="p-button-danger mech-button"
                        onClick={clockOutTimer}
                        disabled={!isClockModalTiming}
                    />
                </div>
            </Dialog>

            <footer className="mech-footer-banner">
                <div className="mech-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="mech-footer-logo" />
            </footer>
        </div>
    );
};

export default MechHomepage;
