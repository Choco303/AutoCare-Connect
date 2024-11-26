/*import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css';
import './css/appointmentPage.css';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const appointmentPage = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const appointments = () => {
        
        const [date, setDate] = useState(null);
      
        

    };  

    return (
        <div className='appointment container'>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Calendar 
                value={date} 
                onChange={(e) => setDate(e.value)}
                showTime 
                showSeconds 
                hourFormat="24" 
                timeOnly={false} 
                dateFormat="mm/dd/yy"
                placeholder="Select Date and Time"
            />
            
        </div>
    );
};
export default appointmentPage; */