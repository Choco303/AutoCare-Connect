import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import './css/base.css';
import './css/rewardsPage.css';

const RewardsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [signUpMessage, setSignUpMessage] = useState("");
    const [isCustomer, setIsCustomer] = useState(false); // Track if the user is a customer
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        // Check if the user is logged in as a customer
        const customerUsername = localStorage.getItem('customerUsername');
        setIsCustomer(!!customerUsername); // Set to true if a customerUsername exists
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const rewards = [
        { title: "Free Full Car Inspection", points: 1000, image: './images/car_inspection_logo.png', alt: "Car Inspection" },
        { title: "Free Air Freshener", points: 2000, image: './images/air_fresh_logo.png', alt: "Free Air Freshener" },
        { title: "Free Oil Change", points: 5000, image: './images/free_oil_change.png', alt: "Free Oil Change" },
        { title: "Half off Service", points: 7000, image: './images/half_off_logo.png', alt: "Half Off Service" },
        { title: "Free set of Tires", points: 10000, image: './images/free_tires_logo.png', alt: "Free Set Of Tires" }
    ];

    const handleButtonClick = () => {
        if (isCustomer) {
            navigate('/rewardsOverview'); // Navigate to rewardsOverview if signed in as a customer
        } else {
            navigate('/login'); // Navigate to login if not signed in
        }
    };

    return (
        <div className="rewards-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="rewards-page-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="rewards-page-menu-icon"
                />
                <h1 className="rewards-page-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="rewards-page-main-content">
                <section className="rewards-page-steps-background">
                    <h2 className="rewards-page-steps-title">How it Works</h2>
                    <div className="rewards-page-steps-align">
                        {["Sign Up", "Earn Points", "Redeem Points"].map((step, index) => (
                            <div key={index} className="rewards-page-step-space">
                                <h2>{index + 1}</h2>
                                <h3>{step}</h3>
                                <p>
                                    {index === 0
                                        ? "Sign up and join the AutoCare club to start earning"
                                        : index === 1
                                            ? "Earn reward points every time you receive a service"
                                            : "Redeem points for exclusive rewards & discounts"}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rewards-page-rewards">
                    <h2>Rewards</h2>
                    <div className="rewards-page-reward-cards">
                        {rewards.map((reward, index) => (
                            <Card key={index} className="rewards-page-reward-card">
                                <h4>{reward.title}</h4>
                                <p>{reward.points} Points</p>
                                <img src={require(`${reward.image}`)} alt={reward.alt} className="rewards-page-reward-image" />
                            </Card>
                        ))}
                    </div>
                    <Button
                        label={isCustomer ? "My Rewards" : "Sign Up"} // Change button label based on login status
                        className="rewards-page-sign-up-button"
                        onClick={handleButtonClick} // Navigate based on login status
                    />
                    {signUpMessage && <p className="rewards-page-signup-message">{signUpMessage}</p>}
                </section>
            </div>

            <footer className="rewards-page-footer-banner">
                <div className="rewards-page-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="rewards-page-footer-logo" />
            </footer>
        </div>
    );
};

export default RewardsPage;
