import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './react/homePage';
import ReviewPage from './react/reviewPage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reviews" element={<ReviewPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
