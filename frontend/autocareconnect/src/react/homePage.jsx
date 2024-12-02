import React, { useState } from 'react';
import Sidebar from './sidebar';
import Logout from './logout';
import './css/homePage.css';
import './css/base.css';

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeFAQ, setActiveFAQ] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index); // Toggle FAQ visibility
    };


    return (
        <div className="home-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            {/* Header banner with menu icon, centered title, and logout */}
            <header className="home-page-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="home-page-menu-icon"
                />
                <h1 className="home-page-banner-title">AutoCare Connect</h1>
                <Logout/>
            </header>

            {/* Hero section */}
            <section className="home-page-hero-section">
                <div className="home-page-hero-content">
                    <img src={require('./images/logo.png')} alt="Logo" className="home-page-hero-logo"/>
                    <div className="home-page-hero-description">
                        <h2>About Us</h2>
                        <p>Providing high-quality car services to keep your vehicle running smoothly.</p>
                    </div>
                </div>
            </section>

            {/* Full-width image section */}
            <section className="home-page-full-width-image">
                <img src={require('./images/picture.png')} alt="Full width"/>
            </section>

            {/* Appointments banner */}
            <section className="home-page-appointments-banner">
                <h3>Some Appointments We Offer</h3>
            </section>

            {/* Alternating service sections */}
            <section className="home-page-service-section">
                <img src={require('./images/oilchange.png')} alt="Oil Change" className="home-page-service-image"/>
                <div className="home-page-service-description">
                    <h4>Oil Change</h4>
                    <p>Regular oil changes keep your engine in top condition.</p>
                </div>
            </section>

            <section className="home-page-service-section reverse">
                <img src={require('./images/tire.png')} alt="Tire Services" className="home-page-service-image"/>
                <div className="home-page-service-description">
                    <h4>Tire Services</h4>
                    <p>We offer tire rotations, balancing, and replacements to keep you safe on the road.</p>
                </div>
            </section>

            <section className="home-page-service-section">
                <img src={require('./images/maintenance.png')} alt="Maintenance" className="home-page-service-image"/>
                <div className="home-page-service-description">
                    <h4>Maintenance</h4>
                    <p>Preventative maintenance to keep your vehicle reliable and efficient.</p>
                </div>
            </section>

            {/* Final full-width banner */}
            <section className="home-page-end-banner">
                <h3>And Much More!</h3>
            </section>

            {/* FAQ Section */}
            <section className="home-page-faq-section">
                <h3>FAQs</h3>
                <h3>Got Questions? We got you covered.</h3>
                <div className="home-page-faq">
                    {[
                        {
                            question: "How often should I get an oil change?",
                            answer: "It’s recommended to get an oil change every 3,000 to 5,000 miles, depending on your car's make and model."
                        },
                        {
                            question: "How long does a tire rotation usually take?",
                            answer: "A typical tire rotation takes about 30 to 45 minutes, depending on your vehicle and current workshop availability."
                        },
                        {
                            question: "What should I bring to my appointment?",
                            answer: "Just your car! If there are any specific issues you're experiencing, feel free to let us know when you book the appointment."
                        },
                    ].map((faq, index) => (
                        <div key={index} className="home-page-faq-item">
                            <div
                                className="home-page-faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h4>{faq.question}</h4>
                                <span className="faq-icon">
                        {activeFAQ === index ? "−" : "+"}
                    </span>
                            </div>
                            {activeFAQ === index && (
                                <p className="home-page-faq-answer">{faq.answer}</p>
                            )}
                            {index < 2 && <hr className="faq-divider"/>} {/* Divider between items */}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="home-page-contact-section">
                <h3>Contact Us</h3>
                <p>Any inquiries? Call us at: <strong>1-800-555-XXX</strong></p>
            </section>

            {/* Footer */}
            <footer className="home-page-footer-banner">
                <div className="home-page-footer-description">Providing quality car management services for your
                    convenience.
                </div>
                <img src={require('./images/logo.png')} alt="Logo" className="home-page-footer-logo"/>
            </footer>
        </div>
    );
};

export default HomePage;