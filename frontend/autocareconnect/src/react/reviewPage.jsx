import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import Sidebar from './sidebar';
import './css/reviewPage.css';

const ReviewPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const maxChars = 300; // Maximum character limit

    // Set six reviews to display as 2 columns x 3 rows
    const [reviews, setReviews] = useState([
        { name: 'John Smith', text: 'AutoCare Connect is a versatile and user-friendly car management website that streamlines communication between customers, mechanics, and administrators for efficient vehicle maintenance.', rating: 5 },
        { name: 'Will Hart', text: 'AutoCare Connect offers a comprehensive platform for seamless vehicle management, connecting users with mechanics and administrators to simplify auto care services.', rating: 5 },
        { name: 'Leo Carter', text: 'AutoCare Connect made managing my car maintenance so much easier—everything from booking appointments to communicating with my mechanic is seamless!', rating: 5 },
        { name: 'Emily Davis', text: 'Thanks to AutoCare Connect, I can easily schedule services and keep track of my vehicle’s maintenance history—it’s a game-changer!', rating: 5 },
        { name: 'Mark Thompson', text: 'AutoCare Connect takes the hassle out of car maintenance with its intuitive interface and easy scheduling—highly recommend!', rating: 5 },
        { name: 'Sarah Mitchell', text: 'AutoCare Connect has simplified my car maintenance routine, making it super easy to book appointments and stay organized.', rating: 5 }
    ]);

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

    const handleSubmit = () => {
        if (name && reviewText && rating > 0) {
            const newReview = { name, text: reviewText, rating };
            const updatedReviews = [newReview, ...reviews.slice(0, 5)];
            setReviews(updatedReviews);
            closeModal();
        } else {
            alert('Please fill out all fields and provide a rating before submitting.');
        }
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setReviewText(text);
        }
    };

    return (
        <div className="review-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">AutoCare Connect</h1>
            </header>

            <h2 className="title">Reviews</h2>
            <div className="reviews-grid">
                {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <p className="review-text">{review.text}</p>
                        <p className="review-author">{review.name}</p>
                        <p className="review-rating">{"⭐".repeat(review.rating)}</p>
                    </div>
                ))}
            </div>
            <Button label="Write Review" className="write-review-button" onClick={openModal} />

            <Dialog visible={displayModal} style={{ width: '50vw' }} onHide={closeModal} className="custom-modal" closable={false}>
                <div className="modal-content">
                    {/* Custom Close Button */}
                    <button className="custom-close-button" onClick={closeModal}>×</button>

                    <h3>Contact Us</h3>
                    <h2 className="modal-title">Write A Review</h2>
                    <div className="star-rating">
                        <Rating value={rating} onChange={(e) => setRating(e.value)} stars={5} cancel={false} />
                    </div>
                    <div className="p-field">
                        <InputText placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
                    <Button label="Send" className="p-button-primary submit-button" onClick={handleSubmit} />
                </div>
            </Dialog>


            <footer className="footer-banner">
                <div className="footer-description">Providing quality car management services for your convenience.</div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo" />
            </footer>
        </div>
    );
};

export default ReviewPage;
