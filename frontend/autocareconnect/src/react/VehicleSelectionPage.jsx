import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import './css/base.css';
import './css/vehicleSelectionPage.css';
import axios from 'axios';

const VehicleSelectionPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [makes, setMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleMakeSelection = (make) => {
        setSelectedMake(make);
        setModels([]);
        setSelectedModel('');
        setYears([]);
        setSelectedYear('');
        if (make) {
            fetchModels(make);
        }
    };

    const handleModelSelection = (model) => {
        setSelectedModel(model);
        if (model) {
            const currentYear = new Date().getFullYear();
            const availableYears = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);
            setYears(availableYears);
        }
    };

    const handleYearSelection = (year) => {
        setSelectedYear(year);
    };

    useEffect(() => {
        fetchMakes();
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
            </header>

            <div className="vehicle-selection-content">
                <h2>Select Your Vehicle</h2>

                {error && <p className="error-message">{error}</p>}

                {/* Step 1: Select Make */}
                <div className="vehicle-selection-step">
                    <h3>Select a Make:</h3>
                    {loading && <p className="loading-message">Loading...</p>}
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

                {/* Step 2: Select Model */}
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

                {/* Step 3: Select Year */}
                {selectedModel && years.length > 0 && (
                    <div className="vehicle-selection-step">
                        <h3>Select a Year:</h3>
                        <select
                            value={selectedYear}
                            onChange={(e) => handleYearSelection(e.target.value)}
                            className="vehicle-dropdown"
                        >
                            <option value="">-- Select Year --</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Final Selection */}
                {selectedMake && selectedModel && selectedYear && (
                    <div className="vehicle-selection-summary">
                        <h3>Your Selection:</h3>
                        <p>Make: {selectedMake}</p>
                        <p>Model: {selectedModel}</p>
                        <p>Year: {selectedYear}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleSelectionPage;
