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
    // sidebar stuff
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // state for service dates and history
    const [serviceHistory, setServiceHistory] = useState([]);
    const [filterByDate, setFilterByDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    // calender
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    // username
    const username = localStorage.getItem('customerUsername');

    // allow to change pages
    const [first, setFirst] = useState(0);
    const [rows] = useState(5);

    // table rows
    const emptyRows = Array.from({ length: Math.max(18 - filterByDate.length, 0) });

    // get the receipts from database
    const fetchReceipts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/receipts/byUsername`, {
                params: { username },
            });

            // Fetch costs for each task
            const receiptsWithCost = await Promise.all(
                response.data.map(async (receipt) => {
                    try {
                        const costResponse = await axios.get(
                            `http://localhost:8080/api/services/cost/${receipt.task}`
                        );
                        return {
                            ...receipt,
                            cost: costResponse.data || 'N/A',
                        };
                    } catch (error) {
                        console.error(`Error fetching cost for ${receipt.task}:`, error);
                        return {
                            ...receipt,
                            cost: 'N/A', // Default if cost fetch fails
                        };
                    }
                })
            );

            const sortedReceipts = receiptsWithCost.sort((a, b) => b.id - a.id);
            setServiceHistory(sortedReceipts);
            setFilterByDate(sortedReceipts);
        } catch (error) {
            console.error('Error fetching receipts:', error.response?.data || error.message);
        }
    };


    // filter by month/year
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

    // close calender
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
                                style={{width: '15rem'}}
                                selectionMode="single"
                            />
                        )}
                    </div>
                    <div>Receipt</div>
                    <div>Repair Type</div>
                    <div>Vehicle</div>
                    <div>Mechanic</div>
                    <div>Cost</div>
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
                            <div>{entry.cost !== 'N/A' ? `$${entry.cost}` : 'Not Available'}</div>
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
                    totalRecords={Math.min(filterByDate.length, rows)}
                    onPageChange={onPageChange}
                    className="repair-info-paginator"
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