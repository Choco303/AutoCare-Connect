import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import Sidebar from './sidebar';
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

    return (
        <div className="review-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <header className="header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">AutoCare Connect</h1>
            </header>

            <h2 className="title">Recent Reviews</h2>
            <div className="reviews-grid">
                {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <p className="review-text">{review.reviewText}</p>
                        <p className="review-author">{review.reviewerName}</p>
                        <p className="review-rating">{"⭐".repeat(review.rating)}</p>
                    </div>
                ))}
            </div>

            <Button label="Write Review" className="write-review-button" onClick={openModal}/>

            <Dialog visible={displayModal} style={{width: '50vw'}} onHide={closeModal} className="custom-modal"
                    closable={false}>
                <div className="modal-content">
                    {/* Custom Close Button */}
                    <button className="custom-close-button" onClick={closeModal}>×</button>

                    <h3>Contact Us</h3>
                    <h2 className="modal-title">Write A Review</h2>
                    <div className="star-rating">
                        <Rating value={rating} onChange={(e) => {
                            setRating(e.value);
                            console.log('Rating updated:', e.value);
                        }} stars={5} cancel={false}/>
                    </div>
                    <div className="p-field">
                        <InputText placeholder="Name" value={name} onChange={(e) => {
                            setName(e.target.value);
                            console.log('Name updated:', e.target.value);
                        }}/>
                    </div>
                    <div className="p-field">
                        <InputTextarea
                            placeholder="Message"
                            value={reviewText}
                            onChange={handleTextChange}
                            rows={5}
                            cols={30}
                            maxLength={maxChars}
                            className="non-resizable-textarea"
                        />
                        <small className="character-count">{`${reviewText.length}/${maxChars} characters`}</small>
                    </div>
                    <Button label="Send" className="p-button-primary submit-button" onClick={handleSubmit}/>
                </div>
            </Dialog>

            <footer className="footer-banner">
                <div className="footer-description">Providing quality car management services for your convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo"/>
            </footer>
        </div>
    );
};

export default ReviewPage;
