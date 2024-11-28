import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import axios from 'axios';
import './css/base.css';
import './css/rewardsOverview.css';

const RewardsOverview = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pointsBalance, setPointsBalance] = useState(0);
    const [redeemedRewards, setRedeemedRewards] = useState([]);
    const [activityHistory, setActivityHistory] = useState([]);
    const [error, setError] = useState('');
    const customerId = localStorage.getItem('customerId');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const rewards = [
        { id: 1, title: "Free Full Car Inspection", points: 1000, image: './images/car_inspection_logo.png', alt: "Car Inspection" },
        { id: 2, title: "Free Air Freshener", points: 2000, image: './images/air_fresh_logo.png', alt: "Air Freshener" },
        { id: 3, title: "10% Off Service", points: 3000, image: './images/10%_logo.png', alt: "10% off" },
        { id: 4, title: "Free Oil Change", points: 5000, image: './images/free_oil_change.png', alt: "Half Off" },
        { id: 5, title: "Half off Service", points: 7000, image: './images/half_off_logo.png', alt: "Set Of Tires" },
        { id: 6, title: "Free set of Tires", points: 10000, image: './images/free_tires_logo.png', alt: "Set Of Tires" }
    ];

    // Fetch rewards and redeemed rewards data
    useEffect(() => {
        const fetchRewardsData = async () => {
            try {
                const rewardsResponse = await axios.get(`http://localhost:8080/api/rewards/customer/${customerId}`);
                const redeemedResponse = await axios.get(`http://localhost:8080/api/rewards/redeemed/${customerId}`);

                if (rewardsResponse.data) {
                    setPointsBalance(rewardsResponse.data.totalPoints - rewardsResponse.data.redeemedPoints);
                }

                if (Array.isArray(redeemedResponse.data)) {
                    setRedeemedRewards(redeemedResponse.data); // Use the JSON array from backend
                } else {
                    setRedeemedRewards([]); // Fallback to empty array
                }
            } catch (err) {
                console.error("Error fetching rewards data:", err);
                setError('Failed to fetch rewards data. Please try again later.');
                setRedeemedRewards([]); // Ensure it's always an array even on error
            }
        };

        if (customerId) fetchRewardsData();
    }, [customerId]);

    useEffect(() => {
        console.log("Redeemed Rewards updated:", redeemedRewards);
    }, [redeemedRewards]);


    // Redeem a reward
    const redeemReward = async (reward) => {
        if (!customerId) {
            setError("Customer ID is missing. Please log in again.");
            return;
        }

        if (pointsBalance >= reward.points) {
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/rewards/redeem/${customerId}`,
                    {
                        rewardType: reward.title,
                        rewardPoints: reward.points,
                    }
                );

                if (response.status === 200) {
                    const newRedeemedReward = response.data;

                    // Parse the redeemedRewards if it's a string
                    const parsedRewards = Array.isArray(newRedeemedReward.redeemedRewards)
                        ? newRedeemedReward.redeemedRewards
                        : JSON.parse(newRedeemedReward.redeemedRewards);

                    // Update Points Balance
                    setPointsBalance((prev) => prev - reward.points);

                    // Append the newly redeemed reward
                    setRedeemedRewards((prev) => [...prev, ...parsedRewards]);

                    // Add to activity history
                    setActivityHistory((prev) => [
                        ...prev,
                        { title: reward.title, date: new Date().toLocaleDateString(), points: -reward.points },
                    ]);

                    console.log("Reward redeemed and UI updated.");
                } else {
                    setError("Failed to redeem reward. Please try again later.");
                }
            } catch (err) {
                setError("Failed to redeem reward. Please try again later.");
                console.error("Error redeeming reward:", err);
            }
        } else {
            alert("Not enough points!");
        }
    };


    return (
        <div className="overview-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <header className="overview-header">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="overview-menu-icon"
                />
                <h1 className="overview-banner-title">AutoCare Connect</h1>
                <Logout/>
            </header>

            <div className="overview-offers-balance">
                <div className="overview-points-balance-box">
                    <h3>Points Balance</h3>
                    <p>{pointsBalance}</p>
                </div>
                <div className="overview-offers">
                    <h2>My Rewards</h2>
                    <div className="overview-offers-list">
                        {redeemedRewards.length > 0 ? (
                            redeemedRewards.map((reward, index) => (
                                <div key={index} className="overview-offer-item">
                                    <span className="overview-offer-description">{reward.rewardType}</span>
                                    <span className="overview-offer-status">
                        {reward.isUsed ? 'Used' : 'Available'}
                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="overview-no-rewards">
                                <p>No rewards redeemed yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <section className="overview-rewards">
                <h2>Redeem Rewards</h2>
                <div className="overview-reward-cards">
                    {rewards.map((reward) => {
                        const isRedeemed = Array.isArray(redeemedRewards) && redeemedRewards.some(
                            (redeemed) => redeemed.rewardType === reward.title && !redeemed.isUsed
                        );

                        console.log(`Reward: ${reward.title}, Is Redeemed: ${isRedeemed}`);

                        return (
                            <Card key={reward.id} className="overview-reward-card">
                                <div className="overview-reward-content">
                                    <h4>{reward.title}</h4>
                                    <p>{reward.points} Points</p>
                                    <img src={require(`${reward.image}`)} alt={reward.alt}
                                         className="overview-reward-image"/>
                                </div>
                                <Button
                                    label="Redeem"
                                    onClick={() => redeemReward(reward)}
                                    className="overview-redeem-button"
                                    disabled={isRedeemed}
                                />
                            </Card>
                        );
                    })}
                </div>
            </section>

            <section className="overview-history">
                <h2>Reward History</h2>
                <ul>
                    {activityHistory.map((activity, index) => (
                        <li key={index} className="overview-history-entry">
                            <span className="overview-history-title">{activity.title}</span>
                            <span className="overview-history-points">{activity.points}</span>
                            <span className="overview-history-date">{activity.date}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default RewardsOverview;
