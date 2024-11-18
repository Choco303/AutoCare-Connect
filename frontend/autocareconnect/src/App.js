import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './react/homePage';
import ReviewPage from './react/reviewPage';
import RewardsPage from './react/rewardsPage';
import CustomerLogin from './react/customerLogin';
import CustomerProfile from "./react/customerProfile";
import RewardsOverview from "./react/rewardsOverview";
import AdminLogin from "./react/adminLogin";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reviews" element={<ReviewPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/login" element={<CustomerLogin />} />
                    <Route path="/customerProfile" element={<CustomerProfile />} />
                    <Route path="/rewardsOverview" element={<RewardsOverview />} />
                    <Route path="/adminLogin" element={<AdminLogin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;