import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './react/homePage';
import ReviewPage from './react/reviewPage';
import RewardsPage from './react/rewardsPage';
import CustomerLogin from './react/CustomerLogin';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reviews" element={<ReviewPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/login" element={<CustomerLogin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;