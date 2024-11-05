import React, { useState } from 'react';
import Sidebar from './sidebar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './css/rewardsPage.css';

const RewardsPage = () => {
    // State to control sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle sidebar visibility
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
    return (

        <div className="rewards-page">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1>AutoCare Connect</h1>
            </header>

            {/* Section explaining steps to earn and redeem rewards */}
            <section className="steps-background">
                <h2 className="steps-title">How it Works</h2>
                <div className="steps-align">
                    {["Sign Up", "Earn Points", "Redeem Points"].map((step, index) => (
                        <div key={index} className="step-space">
                            <h2>{index + 1}</h2>
                            <h3>{step}</h3>
                            <p>{index === 0 ? "Join the AutoCare club to start earning" : index === 1 ? "Earn reward points every time you receive a service" : "Redeem points for exclusive rewards & discounts"}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section displaying reward cards */}
            <section className="rewards">
                <h2>Rewards</h2>
                <div className="reward-cards">
                    {rewards.map((reward, index) => (
                        <Card key={index} className="reward-card">
                            <h4>{reward.title}</h4>
                            <p>{reward.points} Points</p>
                            <img src={require(`${reward.image}`)} alt={reward.alt} className="reward-image" />
                        </Card>
                    ))}
                </div>
                {/* Hey listen! This is the signup button. This needs to connect to sign log screen! */}
                <Button label="Sign Up" className="sign-up-button" />
            </section>

            <footer className="footer">
                <div className="footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo" />
            </footer>
        </div>
    );
};

export default RewardsPage;