import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './sidebar';
import Logout from "./logout";
import './css/base.css';
import './css/vehicleSelectionPage.css';
import axios from 'axios';

const VehicleSelectionPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [makes, setMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [username, setUsername] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUsername = localStorage.getItem('customerUsername');
        if (loggedInUsername) {
            setUsername(loggedInUsername);
        } else {
            setError("User is not logged in.");
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchMakes = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8080/api/vehicles/makes');
            setMakes(response.data.Results || []);
        } catch (err) {
            setError('Failed to fetch vehicle makes. Please try again later.');
        }
        setLoading(false);
    };

    const fetchModels = async (make) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8080/api/vehicles/models?make=${make}`);
            setModels(response.data.Results || []);
        } catch (err) {
            setError('Failed to fetch vehicle models. Please try again later.');
        }
        setLoading(false);
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointment');
            setAppointments(response.data);

            const dates = [
                ...new Set(
                    response.data.map((app) => new Date(app.appointmentDate).toISOString().split('T')[0])
                ),
            ];
            setBookedDates(dates);
        } catch (err) {
            setError('Failed to fetch appointments. Please try again later.');
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services');
            console.log("Fetched Services:", response.data);
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleMakeSelection = (make) => {
        setSelectedMake(make);
        setModels([]);
        setSelectedModel('');
        setSelectedYear('');
        if (make) {
            fetchModels(make);
        }
    };

    const handleModelSelection = (model) => {
        setSelectedModel(model);
        setSelectedYear('');
    };

    const handleYearSelection = (year) => {
        const sanitizedYear = year.replace(/\D/g, '').slice(0, 4);
        setSelectedYear(sanitizedYear);
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setSelectedTime('');

        const bookedTimes = appointments
            .filter((app) => new Date(app.appointmentDate).toISOString().split('T')[0] === date)
            .map((app) =>
                new Date(app.appointmentDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );

        const times = [];
        for (let hour = 7; hour <= 19; hour++) {
            const period = hour < 12 ? 'AM' : 'PM';
            const adjustedHour = hour % 12 || 12;
            times.push(`${adjustedHour.toString().padStart(2, '0')}:00 ${period}`);
            times.push(`${adjustedHour.toString().padStart(2, '0')}:30 ${period}`);
        }

        setAvailableTimes(times.filter((time) => !bookedTimes.includes(time)));
    };

    const handleAppointmentSubmission = async () => {
        if (!selectedDate || !selectedTime || !selectedService || !username) {
            setError('Please complete all fields before booking your appointment.');
            return;
        }

        try {
            const userHasAppointment = appointments.some((app) => app.username === username);
            if (userHasAppointment) {
                setError('An upcoming appointment is already booked for this user.');
                return;
            }

            const selectedServiceDetails = services.find(
                (service) => service.serviceName === selectedService
            );

            if (!selectedServiceDetails) {
                setError('Selected service details not found.');
                return;
            }

            const [hour, minute] = selectedTime.split(/[: ]/);
            const isPM = selectedTime.includes('PM');
            const hourIn24Format = isPM ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
            const appointmentDateTimeString = `${selectedDate}T${hourIn24Format
                .toString()
                .padStart(2, '0')}:${minute.padStart(2, '0')}:00-08:00`;
            const appointmentDateTime = new Date(appointmentDateTimeString);

            if (isNaN(appointmentDateTime.getTime())) {
                setError('Invalid date or time. Please check your input.');
                return;
            }

            const payload = {
                username,
                carMake: selectedMake,
                carModel: selectedModel,
                carYear: selectedYear,
                serviceName: selectedService,
                estimatedTime: selectedServiceDetails.estimatedTime,
                resources: selectedServiceDetails.resources,
                appointmentDate: appointmentDateTime.toISOString(),
                formattedAppointmentTime: `${selectedTime}`,
            };

            const response = await axios.post('http://localhost:8080/api/appointment', payload, {
                headers: {
                    Username: username,
                },
            });

            const receiptId = response.data.receiptId; // Assuming the backend returns a receiptId
            navigate('/confirmation', { state: { receiptId } });
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Failed to book the appointment. Please try again later.');
            } else {
                setError('Failed to book the appointment. Please try again later.');
            }
            console.error('Error during booking:', err);
        }
    };

    useEffect(() => {
        fetchMakes();
        fetchAppointments();
        fetchServices();
    }, []);

    return (
        <div className="vehicle-selection-page">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="vehicle-selection-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="vehicle-selection-menu-icon"
                />
                <h1 className="vehicle-selection-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="vehicle-selection-content">
                <h2>Select Your Vehicle</h2>

                <div className="vehicle-selection-step">
                    <h3>Select a Make:</h3>
                    {loading && <p className="vehicle-loading-message">Loading...</p>}
                    <select
                        value={selectedMake}
                        onChange={(e) => handleMakeSelection(e.target.value)}
                        className="vehicle-dropdown"
                    >
                        <option value="">-- Select Make --</option>
                        {makes.map((make) => (
                            <option key={make.MakeId} value={make.MakeName}>
                                {make.MakeName}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedMake && models.length > 0 && (
                    <div className="vehicle-selection-step">
                        <h3>Select a Model:</h3>
                        <select
                            value={selectedModel}
                            onChange={(e) => handleModelSelection(e.target.value)}
                            className="vehicle-dropdown"
                        >
                            <option value="">-- Select Model --</option>
                            {models.map((model, index) => (
                                <option key={index} value={model.Model_Name}>
                                    {model.Model_Name || 'Unknown Model'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedModel && (
                    <div className="vehicle-selection-step">
                        <h3>Enter the Year:</h3>
                        <input
                            type="text"
                            value={selectedYear}
                            onChange={(e) => handleYearSelection(e.target.value)}
                            className="vehicle-year-input"
                            maxLength="4"
                            inputMode="numeric"
                            placeholder="e.g., 2020"
                        />
                    </div>
                )}

                {selectedMake && selectedModel && selectedYear && (
                    <div className="vehicle-selection-step">
                        <h3>Select a Service:</h3>
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="vehicle-dropdown"
                        >
                            <option value="">-- Select Service --</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.serviceName}>
                                    {service.serviceName} ({service.estimatedTime})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedMake && selectedModel && selectedYear && (
                    <div className="vehicle-selection-step">
                        <h3>Select Appointment Date:</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateSelection(e.target.value)}
                            className={`vehicle-date-input ${bookedDates.includes(selectedDate) && availableTimes.length === 0 ? 'booked' : ''}`}
                            min={today}
                        />

                        {selectedDate && availableTimes.length > 0 && (
                            <div className="vehicle-time-selection">
                                <h3>Select Appointment Time:</h3>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="vehicle-dropdown"
                                >
                                    <option value="">-- Select Time --</option>
                                    {availableTimes.map((time, index) => (
                                        <option key={index} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button onClick={handleAppointmentSubmission} className="vehicle-submit-button">
                            Book Appointment
                        </button>
                        {error && <p className="vehicle-error-message">{error}</p>}
                        {success && <p className="vehicle-success-message">{success}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleSelectionPage;
