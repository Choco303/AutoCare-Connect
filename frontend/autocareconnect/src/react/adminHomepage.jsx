import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import Sidebar from "./sidebar";
import Logout from "./logout";
import "./css/base.css";
import "./css/adminHomepage.css";
import axios from "axios";

const AdminHomepage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [firstReceipts, setFirstReceipts] = useState(0);
    const [rowsReceipts] = useState(5);
    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [previewDates, setPreviewDates] = useState({});
    const [selectedMechanics, setSelectedMechanics] = useState({});
    const [originalMechanics, setOriginalMechanics] = useState({});
    const [isAdminPayStatsModalVisible, setIsAdminPayStatsModalVisible] = useState(false);
    const [selectedAdminDate, setSelectedAdminDate] = useState(null);
    const [mechanicsPayStats, setMechanicsPayStats] = useState([]);
    const [isAvailableAppointmentsModalVisible, setIsAvailableAppointmentsModalVisible] =
        useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const formatClockedTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };


    const fetchCompletedTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/receipts");
            setReceipts(response.data);
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
        }
    };

    const fetchAllMechanicsPayStats = async (date) => {
        try {
            console.log("Fetching pay stats for date:", date);

            const response = await axios.get(`http://localhost:8080/api/receipts`, {
                params: { serviceDate: date },
            });

            const receipts = response.data.filter(
                (receipt) => new Date(receipt.serviceDate).toISOString().split('T')[0] === date
            );

            console.log("Filtered Receipts:", receipts);

            const statsMap = {};

            receipts.forEach((receipt) => {
                const timeTaken = receipt.timeTaken;

                const matches = timeTaken.match(/(\d+)\s*minutes?\s*(\d+)?\s*seconds?/);
                let seconds = 0;
                if (matches) {
                    const minutes = parseInt(matches[1], 10) || 0;
                    const secs = parseInt(matches[2], 10) || 0;
                    seconds = minutes * 60 + secs;
                } else if (timeTaken.match(/(\d+)\s*seconds?/)) {
                    const singleMatch = timeTaken.match(/(\d+)\s*seconds?/);
                    seconds = parseInt(singleMatch[1], 10) || 0;
                }

                if (!statsMap[receipt.mechanicUsername]) {
                    statsMap[receipt.mechanicUsername] = {
                        clockedTime: 0,
                        tasksCompleted: 0,
                        totalPay: 0,
                    };
                }

                statsMap[receipt.mechanicUsername].clockedTime += seconds;
                statsMap[receipt.mechanicUsername].tasksCompleted += 1;
            });

            const hourlyRate = 2000;
            const stats = Object.entries(statsMap).map(([username, data]) => ({
                mechanicUsername: username,
                clockedTime: data.clockedTime,
                tasksCompleted: data.tasksCompleted,
                totalPay: ((data.clockedTime / 3600) * hourlyRate).toFixed(2),
            }));

            console.log("Mechanics Pay Stats Calculated:", stats);

            setMechanicsPayStats(stats);
        } catch (error) {
            console.error("Error fetching mechanics' pay stats:", error);
        }
    };



    const fetchAvailableAppointments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/appointment/available"
            );
            const appointments = response.data;

            const initialMechanics = {};
            appointments.forEach((appointment) => {
                initialMechanics[appointment.receiptId] = appointment.mechanicUsername || "";
            });
            setOriginalMechanics(initialMechanics);

            setAvailableAppointments(appointments);
        } catch (error) {
            console.error("Error fetching available appointments:", error);
        }
    };

    const fetchMechanics = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/mechanic/all");
            setMechanics(response.data);
        } catch (error) {
            console.error("Error fetching mechanics:", error);
        }
    };

    const assignAppointment = async (receiptId, mechanicUsername) => {
        try {
            await axios.post(`http://localhost:8080/api/appointment/assign`, null, {
                params: { receiptId, mechanicUsername },
            });
            fetchAvailableAppointments();
        } catch (error) {
            console.error("Error assigning appointment:", error);
        }
    };

    const handleEditAppointmentDate = async (receiptId, newDate) => {
        try {
            await axios.put(
                `http://localhost:8080/api/appointment/${receiptId}`,
                { appointmentDate: newDate }
            );
            fetchAvailableAppointments();
        } catch (error) {
            console.error("Error updating appointment date:", error);
        }
    };

    useEffect(() => {
        fetchCompletedTasks();
        fetchAvailableAppointments();
        fetchMechanics();
    }, []);

    // Get current date in yyyy-MM-ddTHH:mm format
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="admin-homepage-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="admin-page-header-banner">
                <img
                    src={require("./images/menu.png")}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="admin-page-menu-icon"
                />
                <h1 className="admin-page-banner-title">Autocare Connect</h1>
                <Logout />
            </header>

            <div className="admin-task-section">
                <section className="admin-task-grid-section">
                    {/* Completed Tasks */}
                    <div className="admin-completed-tasks admin-homepage-box">
                        <label className="admin-section-title">All Completed Tasks</label>
                        <table className="admin-completed-tasks-table">
                            <thead>
                            <tr>
                                <th>Receipt ID</th>
                                <th>Mechanic</th>
                                <th>Car</th>
                                <th>Task</th>
                                <th>Date</th>
                                <th>Time Taken</th>
                            </tr>
                            </thead>
                            <tbody>
                            {receipts
                                .slice(firstReceipts, firstReceipts + rowsReceipts)
                                .map((receipt, index) => (
                                    <tr key={index}>
                                        <td>{receipt.receiptId}</td>
                                        <td>{receipt.mechanicUsername || "Unassigned"}</td>
                                        <td>{receipt.carDetails}</td>
                                        <td>{receipt.task}</td>
                                        <td>{receipt.serviceDate}</td>
                                        <td>{receipt.timeTaken}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Paginator
                            first={firstReceipts}
                            rows={rowsReceipts}
                            totalRecords={receipts.length}
                            onPageChange={(e) => setFirstReceipts(e.first)}
                        />
                    </div>

                    {/* Overview section */}
                    <div className="admin-available-appointments admin-homepage-box">
                        <label className="admin-section-title">Manage Appointments</label>
                        <Button
                            label="View"
                            className="p-button-primary admin-button"
                            onClick={() => setIsAvailableAppointmentsModalVisible(true)}
                        />
                        <label className="admin-section-title">View Mechanics Pay</label>
                        <Button
                            label="View"
                            className="p-button-primary admin-button"
                            onClick={() => setIsAdminPayStatsModalVisible(true)}
                        />
                    </div>
                </section>
            </div>

            {/* Appointments Modal */}
            <Dialog
                header="Manage Appointments"
                visible={isAvailableAppointmentsModalVisible}
                onHide={() => setIsAvailableAppointmentsModalVisible(false)}
                className="admin-custom-modal"
            >
                <table className="admin-available-appointments-table">
                    <thead>
                    <tr>
                        <th>Receipt ID</th>
                        <th>Car</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Mechanic</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {availableAppointments.map((appointment) => (
                        <tr key={appointment.receiptId}>
                            <td>{appointment.receiptId}</td>
                            <td>
                                {appointment.carMake} {appointment.carModel}{" "}
                                {appointment.carYear}
                            </td>
                            <td>{appointment.serviceName}</td>
                            <td>
                                <InputText
                                    type="datetime-local"
                                    value={
                                        previewDates[appointment.receiptId] || appointment.appointmentDate
                                    }
                                    min={getCurrentDate()} // Prevent selecting past dates
                                    onChange={(e) =>
                                        setPreviewDates((prev) => ({
                                            ...prev,
                                            [appointment.receiptId]: e.target.value,
                                        }))
                                    }
                                />
                                <Button
                                    label="Adjust Time"
                                    className="p-button-warning admin-button"
                                    onClick={() =>
                                        handleEditAppointmentDate(
                                            appointment.receiptId,
                                            previewDates[appointment.receiptId]
                                        )
                                    }
                                    disabled={
                                        !previewDates[appointment.receiptId] ||
                                        previewDates[appointment.receiptId] ===
                                        appointment.appointmentDate
                                    }
                                />
                            </td>
                            <td>
                                <Dropdown
                                    value={selectedMechanics[appointment.receiptId] || ""}
                                    options={mechanics.map((m) => ({
                                        label: m.username,
                                        value: m.username,
                                    }))}
                                    onChange={(e) =>
                                        setSelectedMechanics((prev) => ({
                                            ...prev,
                                            [appointment.receiptId]: e.value,
                                        }))
                                    }
                                    placeholder="Select Mechanic"
                                />
                            </td>
                            <td>
                                <Button
                                    label="Refresh"
                                    className="p-button-secondary admin-button"
                                    onClick={() => {
                                        setPreviewDates((prev) => ({
                                            ...prev,
                                            [appointment.receiptId]: appointment.appointmentDate,
                                        }));
                                        setSelectedMechanics((prev) => ({
                                            ...prev,
                                            [appointment.receiptId]: originalMechanics[appointment.receiptId],
                                        }));
                                    }}
                                />
                                <Button
                                    label="Assign Mechanic"
                                    className="p-button-primary admin-button"
                                    onClick={() =>
                                        assignAppointment(
                                            appointment.receiptId,
                                            selectedMechanics[appointment.receiptId]
                                        )
                                    }
                                    disabled={!selectedMechanics[appointment.receiptId]}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Dialog>

            <Dialog
                header="View Daily Pay Stats for All Mechanics"
                visible={isAdminPayStatsModalVisible}
                onHide={() => setIsAdminPayStatsModalVisible(false)}
                className="admin-custom-modal"
            >
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
                    <Calendar
                        value={selectedAdminDate}
                        onChange={(e) => {
                            setSelectedAdminDate(e.value);
                            fetchAllMechanicsPayStats(e.value.toISOString().split('T')[0]);
                        }}
                        showIcon
                    />
                </div>
                {mechanicsPayStats.length > 0 && (
                    <table className="admin-pay-stats-table">
                        <thead>
                        <tr>
                            <th>Mechanic</th>
                            <th>Clocked Time</th>
                            <th>Tasks Completed</th>
                            <th>Total Pay</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mechanicsPayStats.map((stats, index) => (
                            <tr key={index}>
                                <td>{stats.mechanicUsername}</td>
                                <td>{formatClockedTime(stats.clockedTime)}</td>
                                <td>{stats.tasksCompleted}</td>
                                <td>${stats.totalPay}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </Dialog>

        </div>
    );
};

export default AdminHomepage;
