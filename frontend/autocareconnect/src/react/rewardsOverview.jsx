import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './css/base.css'
import './css/rewardsOverview.css';

const RewardsOverview = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);
    const [pointsBalance, setPointsBalance] = useState(8000);
    const [redeemedRewards, setRedeemedRewards] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const rewards = [
        { id: 1, title: "Free Full Car Inspection", points: 1000, image: './images/car_inspection_logo.png', alt: "Car Inspection" },
        { id: 2, title: "Free Air Freshener", points: 2000, image: './images/air_fresh_logo.png', alt: "Air Freshener" },
        { id: 3, title: "10% Off Service", points: 3000, image: './images/10%_logo.png', alt: "10% off" },
        { id: 4, title: "Free Oil Change", points: 5000, image: './images/free_oil_change.png', alt: "Half Off" },
        { id: 5, title: "Half off Service", points: 70000, image: './images/half_off_logo.png', alt: "Set Of Tires" },
        { id: 6, title: "Free set of Tires", points: 10000, image: './images/free_tires_logo.png', alt: "Set Of Tires" }
    ];

    const [offers, setOffers] = useState([
        { description: "$15 Off Oil Change", code: "456aBc" }
    ]);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 5000);
        });
    };

    const redeemReward = (reward) => {
        if (pointsBalance >= reward.points) {
            setPointsBalance(pointsBalance - reward.points);

            const numbers = Math.floor(100 + Math.random() * 900); // 3-digit number
            const letters = Array.from({ length: 3 }, () =>
                String.fromCharCode(97 + Math.floor(Math.random() * 26))
            ).join('');
            const code = `${numbers}${letters}`;

            setOffers([...offers, { description: reward.title, code }]);
            setRedeemedRewards([...redeemedRewards, reward.id]);
            setActivityHistory([...activityHistory,
                { title: reward.title, date: new Date().toLocaleDateString(), points: -reward.points }]);
        } else {
            alert('Not enough points!');
        }
    };

    return (
        <div className="overview-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="overview-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="overview-menu-icon"
                />
                <h1 className="overview-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <div className="overview-offers-balance">
                <div className="overview-points-balance-box">
                    <h3>Points Balance</h3>
                    <p>{pointsBalance}</p>
                </div>
                <div className="overview-offers">
                    <h2>Available Offers</h2>
                    <div className="overview-offers-list">
                        {offers.map((offer, index) => (
                            <div key={index} className="overview-offer-item">
                                <span className="overview-offer-description">{offer.description}</span>
                                <span className="overview-offer-code">Code: {offer.code}</span>
                                <Button
                                    label={copiedCode === offer.code ? "Copied!" : "Copy"}
                                    className="overview-copy-button"
                                    onClick={() => copyCode(offer.code)}
                                    icon={copiedCode === offer.code ? "pi pi-check" : "pi pi-copy"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="overview-rewards">
                <h2>Redeem Rewards</h2>
                <div className="overview-reward-cards">
                    {rewards.map((reward) => (
                        <Card key={reward.id} className={`overview-reward-card ${redeemedRewards.includes(reward.id) ? 'overview-redeemed' : ''}`}>
                            <div className="overview-reward-content">
                                <h4>{reward.title}</h4>
                                <p>{reward.points} Points</p>
                                <img src={require(`${reward.image}`)} alt={reward.alt} className="overview-reward-image" />
                            </div>
                            {!redeemedRewards.includes(reward.id) && (
                                <Button label="Redeem" onClick={() => redeemReward(reward)} className="overview-redeem-button" />
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            <section className="overview-history">
                <h2>Reward History</h2>
                <ul>
                    {activityHistory
                        .filter(activity => activity.points < 0)
                        .map((activity, index) => (
                            <li key={index} className="overview-history-entry">
                                <span className="overview-history-title">{activity.title}</span>
                                <span className="overview-history-points">{activity.points < 0 ? "-" : ""}{Math.abs(activity.points)} Points</span>
                                <span className="overview-history-date">{activity.date}</span>
                            </li>
                        ))}
                </ul>
            </section>

            <footer className="overview-footer">
                <div className="overview-footer-description">
                    Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="overview-footer-logo" />
            </footer>
        </div>
    );
};

export default RewardsOverview;
