import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/base.css'
import './css/reviewPage.css';
import axios from 'axios';

const ReviewPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const maxChars = 300;

    const [reviews, setReviews] = useState([]);

    // Fetch reviews on component mount
    useEffect(() => {
        console.log('Fetching reviews from backend...');
        fetchReviews();
    }, []);

    // get reviews from the database and backend
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews?timestamp=${new Date().getTime()}`);
            console.log('Reviews fetched:', response.data);
            setReviews(response.data.slice(0, 6)); // get last 6 reviews
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const openModal = () => setDisplayModal(true);
    const closeModal = () => {
        setDisplayModal(false);
        setName('');
        setReviewText('');
        setRating(0);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // submit a review to the backend
    const handleSubmit = async () => {
        console.log('Name:', name, 'Review Text:', reviewText, 'Rating:', rating);
        if (name && reviewText && rating > 0) {
            const newReview = { reviewerName: name, reviewText: reviewText, rating }; // update the field

            console.log('Submitting new review:', newReview);
            try {
                const response = await axios.post('http://localhost:8080/api/reviews', newReview);
                console.log('Review submitted successfully:', response.data);
                fetchReviews(); // update the reviews
                closeModal();
            } catch (error) {
                console.error('Error submitting review:', error);
            }
        } else {
            alert('Please fill out all fields and provide a rating before submitting.');
        }
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setReviewText(text);
            console.log(`Review text updated: ${text.length}/${maxChars} characters`);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="review-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="review-page-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="review-page-menu-icon"
                />
                <h1 className="review-page-banner-title">AutoCare Connect</h1>
                <Logout />
            </header>

            <h2 className="review-page-title">Reviews</h2>
            <div className="review-page-reviews-grid">
                {reviews.map((review, index) => (
                    <div key={index} className="review-page-review-card">
                        <p className="review-page-review-text">{review.reviewText}</p>
                        <p className="review-page-review-author">{review.reviewerName}</p>
                        <p className="review-page-review-rating">{"⭐".repeat(review.rating)}</p>
                        <p className="review-page-review-date">{formatDate(review.reviewDate)}</p>
                    </div>
                ))}
            </div>

            <Button label="Write Review" className="review-page-write-review-button" onClick={openModal} />

            <Dialog
                visible={displayModal}
                onHide={closeModal}
                className="write-review-modal"
                closable={false}
            >
                <div className="write-review-modal-container">
                    <button
                        className="write-review-modal-close-button"
                        onClick={closeModal}
                    >
                        ×
                    </button>
                    <h2 className="write-review-modal-header">Write a Review</h2>
                    <div className="write-review-modal-rating">
                        <Rating
                            value={rating}
                            onChange={(e) => setRating(e.value)}
                            stars={5}
                            cancel={false}
                        />
                    </div>
                    <InputText
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="write-review-modal-input"
                    />
                    <InputTextarea
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={handleTextChange}
                        rows={5}
                        maxLength={maxChars}
                        className="write-review-modal-textarea"
                    />
                    <small className="write-review-modal-character-count">
                        {`${reviewText.length}/${maxChars} characters`}
                    </small>
                    <Button
                        label="Submit"
                        className="write-review-modal-submit-button"
                        onClick={handleSubmit}
                    />
                </div>
            </Dialog>


            <footer className="review-page-footer-banner">
                <div className="review-page-footer-description">Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="review-page-footer-logo" />
            </footer>
        </div>
    );
};

export default ReviewPage;
