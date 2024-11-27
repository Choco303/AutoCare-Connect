import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css';
import './css/appointmentPage.css';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const appointmentPage = () => {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [service, setService] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const serviceTypes = [
        { name: 'Oil and Oil Filter Change'},
        { name: 'Wheel Alignment'},
        { name: 'Blinker Fluid Replacement'},
        { name: 'Windshield Wiper Replacement'},
        { name: 'Anti-Freeze replacement' },
        { name: 'Air Filter Replacement' },
        { name: 'Spark Plug Replacement' },
        { name: 'Alternator Repair/Replace' },
        { name: 'Radiator Hose Check/Replace' },
        { name: 'Transmission fluid Check/Replace' },
        { name: 'Tire Patch/Repair/Replace' },
        { name: 'Tire pressure fill up' }


    ];

    const appointmentTimes = [
        { name: '7:00 am'},
        { name: '7:30 pm'},
        { name: '8:00 pm'},
        { name: '9:00 pm'},
        { name: '10:00 pm' }
    ];

    const appointmentConfirm = () => {
        alert(`Appointment confirmed for ${date.toLocaleDateString()} at ${time}`);
    };

    return (
        <div className='appointment container'>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h2>Input your Appointment</h2>
        
            <div className='Service Type'>
            <Dropdown 
                value={service} 
                onChange={(e) => setService(e.value)}
                options={serviceTypes}
                optionLabel='name'
                placeholder='Select a Service Type'
                checkmark={true}  
                highlightOnSelect={false}
                editable
                showClear
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



            <Button label="Submit Appointment" icon="pi pi-check" onClick={appointmentConfirm} />



        </div>
    );
};
export default appointmentPage; 