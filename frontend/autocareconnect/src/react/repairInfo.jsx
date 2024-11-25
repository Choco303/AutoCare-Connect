import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Sidebar from './sidebar';
import Logout from './logout';
import axios from "axios";
import './css/base.css';
import './css/repairInfo.css';

const RepairInfo = () => {
    // Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // State for service history data
    const [serviceHistory, setServiceHistory] = useState([]);
    const [filterByDate, setFilterByDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    // Calendar and table filter
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    // Username (retrieved from localStorage)
    const username = localStorage.getItem('customerUsername');

    // Pagination states
    const [first, setFirst] = useState(0);
    const [rows] = useState(5); // Rows per page

    // Generate table rows
    const emptyRows = Array.from({ length: Math.max(18 - filterByDate.length, 0) });

    // Fetch receipts for the current user
    const fetchReceipts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/receipts/byUsername`, {
                params: { username },
            });
            const receiptsWithStatus = response.data.map((receipt) => ({
                ...receipt,
                status: "Completed",
            }));
            // Sort by id in descending order
            const sortedReceipts = receiptsWithStatus.sort((a, b) => b.id - a.id);

            setServiceHistory(sortedReceipts);
            setFilterByDate(sortedReceipts);
        } catch (error) {
            console.error('Error fetching receipts:', error.response?.data || error.message);
            alert('Failed to fetch service history. Please try again later.');
        }
    };

    // Filters table by month and/or year
    const handleDateChange = (e) => {
        setSelectedDate(e.value);
        setIsCalendarOpen(false);

        const selectedMonth = e.value.getMonth();
        const selectedYear = e.value.getFullYear();
        setFilterByDate(
            serviceHistory.filter(entry => {
                const entryDate = new Date(entry.serviceDate);
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

    // get the username for local storage
    useEffect(() => {
        if (username) {
            fetchReceipts();
        } else {
            console.error('Username is not available in localStorage.');
        }
    }, []);

    const onPageChange = (event) => {
        setFirst(event.first);
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
                    <div>Receipt</div>
                    <div>Repair Type</div>
                    <div>Vehicle</div>
                    <div>Mechanic</div>
                    <div>Status</div>
                </div>
                <div className="service-history-rows">
                    {filterByDate.map((entry, index) => (
                        <div
                            className="service-history-row"
                            key={index}
                        >
                            <div>{entry.serviceDate}</div>
                            <div>{entry.receiptId}</div>
                            <div>{entry.task}</div>
                            <div>{entry.carDetails}</div>
                            <div>{entry.mechanicUsername}</div>
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
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={filterByDate.length}
                    onPageChange={onPageChange}
                />
            </div>
            <footer className="repair-info-footer">
                <div className="footer-description">Providing quality car management services for your convenience.</div>
                <div className="footer-logo">
                    <img src={require('./images/logo.png')} alt="Logo" />
                </div>
            </footer>
        </div>
    );
};

export default RepairInfo;