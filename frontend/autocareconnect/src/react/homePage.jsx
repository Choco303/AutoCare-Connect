import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/homePage.css';

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header banner with menu icon and centered title */}
            <header className="header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="menu-icon"
                />
                <h1 className="banner-title">AutoCare Connect</h1>
            </header>

            {/* Hero section */}
            <section className="hero-section">
                <div className="hero-content">
                    <img src={require('./images/logo.png')} alt="Logo" className="hero-logo" />
                    <div className="hero-description">
                        <h2>About Us</h2>
                        <p>We provide high-quality car services to keep your vehicle running smoothly.</p>
                    </div>
                </div>
            </section>

            {/* Full-width image section */}
            <section className="full-width-image">
                <img src={require('./images/picture.png')} alt="Full width" />
            </section>

            {/* Appointments banner */}
            <section className="appointments-banner">
                <h3>Some Appointments We Offer</h3>
            </section>

            {/* Alternating service sections */}
            <section className="service-section">
                <img src={require('./images/oilchange.png')} alt="Oil Change" className="service-image" />
                <div className="service-description">
                    <h4>Oil Change</h4>
                    <p>Regular oil changes keep your engine in top condition.</p>
                </div>
            </section>

            <section className="service-section reverse">
                <img src={require('./images/tire.png')} alt="Tire Services" className="service-image"/>
                <div className="service-description">
                    <h4>Tire Services</h4>
                    <p>We offer tire rotations, balancing, and replacements to keep you safe on the road.</p>
                </div>
            </section>

            <section className="service-section">
                <img src={require('./images/maintenance.png')} alt="Maintenance" className="service-image" />
                <div className="service-description">
                    <h4>Maintenance</h4>
                    <p>Preventative maintenance to keep your vehicle reliable and efficient.</p>
                </div>
            </section>

            {/* Final full-width banner */}
            <section className="end-banner">
                <h3>And Much More!</h3>
            </section>

            {/* Footer */}
            <footer className="footer-banner">
                <div className="footer-description">Providing quality car management services for your convenience.</div>
                <img src={require('./images/logo.png')} alt="Logo" className="footer-logo" />
            </footer>
        </div>
    );
};

export default HomePage;