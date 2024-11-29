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
    const [refreshKey, setRefreshKey] = useState(0);
    const [isClockModalVisible, setIsClockModalVisible] = useState(false);
    const [clockModalStartTime, setClockModalStartTime] = useState(null);
    const [clockModalElapsedTime, setClockModalElapsedTime] = useState(0);
    const [isClockModalTiming, setIsClockModalTiming] = useState(false);
    const [isCompletedTasksModalVisible, setIsCompletedTasksModalVisible] = useState(false);
    const [isAvailableAppointmentsModalVisible, setIsAvailableAppointmentsModalVisible] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows] = useState(5);

    // appointment
    const [availableAppointments, setAvailableAppointments] = useState([]);

    // assignment appointment stuff
    const [assignedAppointment, setAssignedAppointment] = useState(() => {
        const savedAppointment = localStorage.getItem('assignedAppointment');
        return savedAppointment ? JSON.parse(savedAppointment) : null;
    });
    const mechanicUsername = localStorage.getItem('mechanicUsername');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // task timer
    const handleStartTask = () => {
        if (!assignedAppointment) return;
        setStartTime(Date.now());
        setIsTiming(true);
    };

    // handle when mechanic click finish after starting the time and then it will put the stats into the database which then goes to the
    // information of the customer
    const handleFinishTask = async () => {
        if (!assignedAppointment) return;

        try {
            const elapsedMinutes = Math.floor(elapsedTime / 60);
            const elapsedSeconds = elapsedTime % 60;

            const timeString =
                elapsedMinutes > 0
                    ? `${elapsedMinutes} minutes ${elapsedSeconds} seconds`
                    : `${elapsedSeconds} seconds`;

            const receipt = {
                receiptId: assignedAppointment.receiptId,
                carDetails: `${assignedAppointment.carMake} ${assignedAppointment.carModel} ${assignedAppointment.carYear}`,
                task: assignedAppointment.serviceName,
                serviceDate: new Date().toISOString().split('T')[0], // ISO date format
                timeTaken: timeString,
                mechanicUsername,
                username: assignedAppointment.username,
            };

            // send receipt and delete appointment
            await axios.post(`http://localhost:8080/api/receipts`, receipt);
            await axios.delete(`http://localhost:8080/api/appointment/${assignedAppointment.receiptId}`);

            // reset data
            setAssignedAppointment(null);
            localStorage.removeItem('assignedAppointment');
            setElapsedTime(0);
            setIsTiming(false);

            // fetch updated data
            fetchAvailableAppointments();
            fetchCompletedTasks();
        } catch (error) {
            console.error('Error finishing task:', error);
        }
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

    // get the receipts from the database and backend
    const fetchAvailableAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointment/available`);
            const allAppointments = response.data;

            // Filter appointments where mechanic_username is null
            const filteredAppointments = allAppointments.filter(
                (appointment) => !appointment.mechanicUsername
            );

            setAvailableAppointments(filteredAppointments);
        } catch (error) {
            console.error('Error fetching available appointments:', error);
        }
    };


    // get the assignment appointment which then updates the page
    const fetchAssignedAppointment = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/appointment/assigned`, {
                params: { mechanicUsername },
            });

            console.log("Assigned appointment response:", response.data);

            if (response.data) {
                setAssignedAppointment(response.data);
                localStorage.setItem('assignedAppointment', JSON.stringify(response.data));
            } else {
                setAssignedAppointment(null);
                localStorage.removeItem('assignedAppointment');
            }
        } catch (error) {
            console.error('Error fetching assigned appointment:', error);
            setAssignedAppointment(null);
            localStorage.removeItem('assignedAppointment');
        }
    };


    // helps assign appointment
    const assignAppointment = async (receiptId) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/appointment/assign`,
                null,
                { params: { receiptId, mechanicUsername } }
            );

            console.log('Appointment assigned:', response.data);

            // Fetch the newly assigned appointment and update the state
            fetchAssignedAppointment();
        } catch (error) {
            console.error('Error assigning appointment:', error.response?.data?.error || error.message);
        }
    };

    // get all completed tasks from the certain mechanic
    const fetchCompletedTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/receipts/byMechanic`, {
                params: { username: mechanicUsername },
            });
            setReceipts(response.data);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    useEffect(() => {
        fetchAvailableAppointments();
        fetchAssignedAppointment();
        fetchCompletedTasks();
    }, [mechanicUsername]);

    useEffect(() => {
        fetchAssignedAppointment();
        fetchAvailableAppointments();
    }, [refreshKey]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
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

    const formatElapsedTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours} hours ${minutes} minutes ${remainingSeconds} seconds`;
        } else if (minutes < 10) {
            return `${minutes} minutes ${remainingSeconds} seconds`;
        } else {
            return `${minutes} minutes`;
        }
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
                        <label htmlFor="tasks">Current Task</label>
                        <label htmlFor="customer">Customer</label>
                        <InputText id="customer" value={assignedAppointment?.username || 'Not Assigned'} readOnly/>
                        <label htmlFor="contact">Contact Info</label>
                        <InputText id="contact" value={assignedAppointment?.phone || 'Not Assigned'} readOnly/>
                        <label htmlFor="car">Car</label>
                        <InputText id="car"
                                   value={assignedAppointment ? `${assignedAppointment.carMake} ${assignedAppointment.carModel} ${assignedAppointment.carYear}` : 'Not Assigned'}
                                   readOnly/>
                        <label htmlFor="taskName">Service</label>
                        <InputText id="taskName" value={assignedAppointment?.serviceName || 'Not Assigned'} readOnly/>
                        <label htmlFor="time">Estimated Time</label>
                        <InputText id="time" value={assignedAppointment?.estimatedTime || 'Not Assigned'} readOnly/>
                    </div>


                    {/* Resources */}
                    <div className="mech-resources mech-homepage-box">
                        <label htmlFor="resources">Resources</label>
                        <label htmlFor="parts">Parts</label>
                        <InputText id="resources" value={assignedAppointment?.resources || 'Not Assigned'} readOnly/>
                    </div>

                    {/* Shared Column for Current Task and Upcoming Tasks */}
                    <div style={{display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px'}}>
                        {/* Current Task */}
                        <div className="mech-current-task mech-homepage-box">
                            <label>Current Task:</label>
                            <p>
                                <strong>Status:</strong> {isTiming ? 'In Progress' : assignedAppointment ? 'Not Started' : 'No Task Assigned'}
                            </p>
                            <p>
                                <strong>Elapsed Time:</strong> {isTiming ? formatElapsedTime(elapsedTime) : '00:00'}
                            </p>
                            <div className="mech-button-row">
                                <Button
                                    label="Start Task"
                                    className="p-button-success mech-button"
                                    onClick={handleStartTask}
                                    disabled={!assignedAppointment || isTiming}
                                />
                                <Button
                                    label="Finish"
                                    className="p-button-danger mech-button"
                                    onClick={handleFinishTask}
                                    disabled={!assignedAppointment || !isTiming}
                                />
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="mech-upcoming-tasks mech-homepage-box">
                            <label htmlFor="upcoming">Upcoming Tasks</label>
                            {availableAppointments.slice(0, 2).map((appointment, index) => (
                                <div key={index} className="mech-upcoming-task">
                                    <label>{`${appointment.carMake} ${appointment.carModel} ${appointment.carYear}`}</label>
                                    <InputText value={`${appointment.serviceName}`} readOnly/>
                                    <InputText value={`${formatDateTime(appointment.appointmentDate)}`} readOnly/>
                                </div>
                            ))}
                            {availableAppointments.length === 0 && <p>No upcoming tasks available.</p>}
                        </div>
                    </div>

                    {/* Recently Completed Tasks */}
                    <div className="mech-recently-completed mech-homepage-box">
                        <label htmlFor="recentlyCompleted">Recently Completed Tasks</label>
                        {receipts
                            .slice()
                            .reverse() // Reverse the order to show the latest tasks first
                            .slice(0, 2) // Get the latest two tasks
                            .map((receipt, index) => (
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
                            onClick={() => setIsCompletedTasksModalVisible(true)}
                        />
                    </div>
                </section>

                {/* Clock In/Out Button */}
                <Button
                    label="Clock In/Out"
                    className="p-button-primary mech-button mech-clock-modal-button"
                    onClick={openClockModal}
                />
                {/* View Available Appointments */}
                <Button
                    label="View Available Appointments"
                    className="p-button-primary mech-button"
                    onClick={() => setIsAvailableAppointmentsModalVisible(true)}
                />
            </div>

            {/* Modal for Completed Tasks */}
            <Dialog
                header={<span className="mech-receipt-table-header">Recently Completed Tasks</span>}
                visible={isCompletedTasksModalVisible}
                onHide={() => setIsCompletedTasksModalVisible(false)}
                className="mech-custom-modal"
            >
                {receipts.length > 0 ? (
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
                        {receipts
                            .slice()
                            .reverse()
                            .slice(first, first + rows)
                            .map((receipt, index) => (
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
                ) : (
                    <p>No completed tasks available.</p>
                )}
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

            {/* Modal for Viewing Appointments */}
            <Dialog
                header="Available Appointments"
                visible={isAvailableAppointmentsModalVisible}
                onHide={() => setIsAvailableAppointmentsModalVisible(false)}
                className="mech-custom-modal"
            >
                <table className="mech-available-appointments-table">
                    <thead>
                    <tr>
                        <th>Receipt ID</th>
                        <th>Car</th>
                        <th>Service</th>
                        <th>Date/Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {availableAppointments.map((appointment) => (
                        <tr key={appointment.receiptId}>
                            <td>{appointment.receiptId}</td>
                            <td>
                                {appointment.carMake} {appointment.carModel} {appointment.carYear}
                            </td>
                            <td>{appointment.serviceName}</td>
                            <td>{formatDateTime(appointment.appointmentDate)}</td>
                            <td>
                                <Button
                                    label="Assign"
                                    className="mech-assign-button"
                                    onClick={() => assignAppointment(appointment.receiptId)}
                                    disabled={!!assignedAppointment}
                                />

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
