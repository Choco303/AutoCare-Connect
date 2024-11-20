import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './react/homePage';
import ReviewPage from './react/reviewPage';
import RewardsPage from './react/rewardsPage';
import CustomerLogin from './react/customerLogin';
import CustomerHomepage from "./react/customerHomepage";
import RewardsOverview from "./react/rewardsOverview";
import AdminLogin from "./react/adminLogin";
import MechanicLogin from "./react/mechanicLogin";
import AdminHomepage from "./react/adminHomepage"
import MechanicHomepage from "./react/mechanicHomepage"


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reviews" element={<ReviewPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/rewardsOverview" element={<RewardsOverview />} />
                    <Route path="/login" element={<CustomerLogin />} />
                    <Route path="/customerHomepage" element={<CustomerHomepage />} />
                    <Route path="/adminLogin" element={<AdminLogin />} />
                    <Route path="/adminHomepage" element={<AdminHomepage />} />
                    <Route path="/mechanicLogin" element={<MechanicLogin />} />
                    <Route path="/mechanicHomepage" element={<MechanicHomepage/>} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;