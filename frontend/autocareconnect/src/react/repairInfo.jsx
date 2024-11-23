import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css';
import './css/repairInfo.css';


// Dummy data for repair information.
const RepairInfo = () => {
    const [serviceHistory] = useState([
        { date: '2024-11-18', repairType: 'Oil Change', repairsDone: 'Oil filter replaced', transactionID: '12345', vehicle: 'Toyota Camry', status: 'Completed', mechanicComments: 'Replaced the oil filter and topped off all fluids. Everything looks good!' },
        { date: '2024-11-15', repairType: 'Tire Rotation', repairsDone: 'Tires rotated', transactionID: '12346', vehicle: 'Honda Civic', status: 'In Progress', mechanicComments: 'Rotated tires but noticed uneven tread wear. Recommend alignment check.' },
        { date: '2024-12-05', repairType: 'Battery Replacement', repairsDone: 'New battery installed', transactionID: '12348', vehicle: 'Tesla Model 3', status: 'Completed', mechanicComments: 'Replaced battery and checked all electrical systems.' },
        { date: '2024-12-20', repairType: 'Coolant Flush', repairsDone: 'Flushed and refilled coolant', transactionID: '12349', vehicle: 'Chevrolet Malibu', status: 'Completed', mechanicComments: 'Performed coolant flush. Engine temperature is stable.' },
    ]);

    // Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Calendar and table filter
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarRef = useRef(null);
    const [filterByDate, setFilterByDate] = useState(serviceHistory); // Renamed filteredHistory to filterByDate

    // Mechanic comments
    const [isCommentsOpen, setIsCommentsOpen] = useState(false); // Renamed isModalOpen and setIsModalOpen
    const closeComments = () => setIsCommentsOpen(false); // Renamed closeModal to closeComments
    const [selectedComments, setSelectedComments] = useState('');

    // Generate table rows
    const emptyRows = Array.from({ length: Math.max(18 - filterByDate.length, 0) });



    // Filters table by month and/or year
    const handleDateChange = (e) => {
        setSelectedDate(e.value);
        setIsCalendarOpen(false);

        const selectedMonth = e.value.getMonth();
        const selectedYear = e.value.getFullYear();
        setFilterByDate(
            serviceHistory.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
            })
        );
    };

    // Closes calendar when clicking outside its box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };
        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCalendarOpen]);

    // Allows rows to be clicked. Opens mechanic comments
    const handleRowClick = (comments) => {
        setSelectedComments(comments);
        setIsCommentsOpen(true); // Updated to setIsCommentsOpen
    };

    // MechanicComments
    const MechanicComments = ({ isOpen, onClose, content }) => {
        if (!isOpen) return null;
        return (
            <div className="comments-overlay">
                <div className="comments-container">
                    <div className="comments-header">
                        <h2>Mechanic Comments</h2>
                        <button className="comments-close" onClick={onClose}>×</button>
                    </div>
                    <div className="comments-body">
                        <p>{content || 'No comments available.'}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="repair-info-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <header className="repair-info-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="overview-menu-icon"
                />
                <h1 className="overview-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="service-history">
                <h2 className="service-history-title">Service History</h2>
                <div className="service-history-header">
                    <div className="date-filter-container">
                        <button
                            className="date-filter"
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        >
                            Date {selectedDate ? selectedDate.toLocaleDateString() : 'Select'}
                        </button>
                        {isCalendarOpen && (
                            <Calendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                view="month"
                                dateFormat="mm/yy"
                                inline
                                style={{ width: '15rem' }}
                                selectionMode="single"
                            />
                        )}
                    </div>
                    <div>Repair Type</div>
                    <div>Repairs Done</div>
                    <div>Transaction ID</div>
                    <div>Vehicle</div>
                    <div>Status</div>
                </div>
                <div className="service-history-rows">
                    {filterByDate.map((entry, index) => (
                        <div
                            className="service-history-row"
                            key={index}
                            onClick={() => handleRowClick(entry.mechanicComments)}
                        >
                            <div>{entry.date}</div>
                            <div>{entry.repairType}</div>
                            <div>{entry.repairsDone}</div>
                            <div>{entry.transactionID}</div>
                            <div>{entry.vehicle}</div>
                            <div className={`status-${entry.status.toLowerCase().replace(' ', '-')}`}>
                                {entry.status}
                            </div>
                        </div>
                    ))}
                    {emptyRows.map((_, index) => (
                        <div className="service-history-row empty-row" key={`empty-${index}`}>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="repair-info-footer">
                <div className="footer-description">Providing quality car management services for your convenience.</div>
                <div className="footer-logo">
                    <img src={require('./images/logo.png')} alt="Logo" />
                </div>
            </footer>

            <MechanicComments isOpen={isCommentsOpen} onClose={closeComments} content={selectedComments} />
        </div>
    );
};

export default RepairInfo;