import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css';
import './css/appointmentPage.css';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const appointmentPage = () => {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const appointmentConfirm = () => {
        alert(`Appointment confirmed for ${date.toLocaleDateString()} at ${time}`);
    };

    return (
        <div className='appointment container'>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h2>Input your Appointment</h2>
        
            <div className='Date Select'>
            <label htmlFor="date">Select Date</label>
            <Calendar 
                id = 'date'
                value={date} 
                onChange={(e) => setDate(e.value)}
                inline
                dateFormat="mm/dd/yy"
                placeholder="Select Date and Time"
            />
            </div>

            <div className='Time Select'>
            <label htmlFor="time">Select Time</label>
            <Calendar
                id="time"
                value={time}
                showTime
                timeOnly
                onChange={(e) => setTime(e.value)}
                hourFormat="12"
            />
            </div>

            <div className='Additional Details'>
            <label htmlFor="details">Additional Details</label>
            <InputText
                id='details'
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Enter aditional details about your appointment (optional)"
            />
            </div>

            <Button label="Submit Appointment" icon="pi pi-check" onClick={appointmentConfirm} />



        </div>
    );
};
export default appointmentPage; 