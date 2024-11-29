import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './sidebar';
import Logout from "./logout";
import './css/base.css';
import './css/appointmentPage.css';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import axios from 'axios';

const AppointmentPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [makes, setMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [availableRewards, setAvailableRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState('');
    const today = new Date();
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUsername = localStorage.getItem('customerUsername');
        if (loggedInUsername) {
            setUsername(loggedInUsername);
            fetchMakes();
            fetchServices();
            fetchAppointments();
            fetchRewards(); // No need to pass username
        } else {
            setError("User is not logged in.");
        }
    }, []);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchMakes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vehicles/makes');
            setMakes(response.data.Results || []);
        } catch (err) {
            setError('Failed to fetch vehicle makes.');
        }
    };

    const fetchModels = async (make) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/vehicles/models?make=${make}`);
            setModels(response.data.Results || []);
        } catch (err) {
            setError('Failed to fetch vehicle models.');
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services');
            setServices(response.data);
        } catch (err) {
            setError('Failed to fetch services.');
        }
    };

    const fetchRewards = async () => {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            setError('Customer ID not found in local storage.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/appointment/rewards/${customerId}`);
            console.log('Rewards fetched:', response.data); // Log the rewards data
            setAvailableRewards(response.data || []);
        } catch (err) {
            console.error('Error fetching rewards:', err.response?.data || err.message);
            setError('Failed to fetch rewards.');
        }
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
            setError('Failed to fetch appointments.');
        }
    };

    const handleMakeSelection = (make) => {
        setSelectedMake(make);
        setModels([]);
        setSelectedModel('');
        setSelectedYear('');
        fetchModels(make);
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

        const dateString = date.toISOString().split('T')[0];
        const bookedTimes = appointments
            .filter((app) => new Date(app.appointmentDate).toISOString().split('T')[0] === dateString)
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

    const handleRewardRedemption = async () => {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            setError('Customer ID is required.');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/rewards/use/${customerId}`,
                null,
                { params: { rewardType: selectedReward } }  // Send rewardType as query parameter
            );
            console.log('Reward redeemed successfully:', response.data);
        } catch (err) {
            setError('Error redeeming reward: ' + (err.response?.data?.message || err.message));
            console.error('Error redeeming reward:', err.response?.data || err.message);
        }
    };

    const handleAppointmentSubmission = async () => {
        if (!selectedMake || !selectedModel || !selectedYear || !selectedService || !selectedDate || !selectedTime) {
            setError('Fill all the fields before booking.');
            return;
        }

        try {
            const selectedServiceDetails = services.find(
                (service) => service.serviceName === selectedService
            );

            if (!selectedServiceDetails) {
                setError('Selected service details not found.');
                return;
            }

            const payload = {
                carMake: selectedMake,
                carModel: selectedModel,
                carYear: selectedYear,
                serviceName: selectedService,
                estimatedTime: selectedServiceDetails.estimatedTime,
                resources: selectedServiceDetails.resources,
                appointmentDate: selectedDate.toISOString(),
                formattedAppointmentTime: selectedTime,
                selectedReward: selectedReward || null, // Include reward only if selected
            };

            console.log('Payload being sent:', payload);

            await axios.post('http://localhost:8080/api/appointment', payload, {
                headers: {
                    Username: username,
                },
            });

            // After submitting the appointment, redeem the reward
            if (selectedReward) {
                handleRewardRedemption();
            }

            navigate('/confirmation', { state: { receiptId: payload } });
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to book the appointment. Please try again.');
        }
    };





    return (
        <div className="appointment-page">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="appointment-header">
                <h1>AutoCare Connect</h1>
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="appointment-menu-icon"
                />
                <Logout />
            </header>

            <main className="appointment-content">
                <h2>Create Your Appointment!</h2>

                <label>Select a Make:</label>
                <select
                    value={selectedMake}
                    onChange={(e) => handleMakeSelection(e.target.value)}
                    className="appointment-dropdown"
                >
                    <option value="">-- Select Make --</option>
                    {makes.map((make) => (
                        <option key={make.MakeId} value={make.MakeName}>
                            {make.MakeName}
                        </option>
                    ))}
                </select>

                {selectedMake && (
                    <>
                        <label>Select a Model:</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => handleModelSelection(e.target.value)}
                            className="appointment-dropdown"
                        >
                            <option value="">-- Select Model --</option>
                            {models.map((model) => (
                                <option key={model.Model_Name} value={model.Model_Name}>
                                    {model.Model_Name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {selectedModel && (
                    <>
                        <label>Enter the Year:</label>
                        <input
                            type="text"
                            value={selectedYear}
                            onChange={(e) => handleYearSelection(e.target.value)}
                            className="appointment-year-input"
                            maxLength="4"
                            placeholder="e.g., 2020"
                        />
                    </>
                )}

                {selectedYear && (
                    <>
                        <label>Select Service:</label>
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="appointment-dropdown"
                        >
                            <option value="">-- Select Service --</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.serviceName}>
                                    {service.serviceName} ({service.estimatedTime})
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {selectedService && (
                    <>
                        <label>Select Date:</label>
                        <Calendar
                            value={selectedDate}
                            onChange={(e) => handleDateSelection(e.value)}
                            minDate={today}
                            className="appointment-calendar"
                        />
                    </>
                )}

                {selectedDate && (
                    <>
                        <label>Select Time:</label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="appointment-dropdown"
                        >
                            <option value="">-- Select Time --</option>
                            {availableTimes.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {selectedTime && (
                    <>
                        <label>Select Reward (Optional):</label>
                        <select
                            value={selectedReward}
                            onChange={(e) => setSelectedReward(e.target.value)}
                            className="appointment-dropdown"
                        >
                            <option value="">-- Select Reward --</option>
                            {availableRewards.map((reward, index) => (
                                <option key={index} value={reward.rewardType}>
                                    {reward.rewardType} ({reward.rewardPoints} points)
                                </option>
                            ))}
                        </select>
                    </>
                )}


                {error && <p className="error-message">{error}</p>}
                <Button label="Submit" onClick={handleAppointmentSubmission} className="appointment-submit-button" />
            </main>
        </div>
    );
};

export default AppointmentPage;
