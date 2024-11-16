import React, { useState } from 'react';
import Sidebar from './sidebar';
import './css/homePage.css';
import './css/base.css'

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home-page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header banner with menu icon and centered title */}
            <header className="home-page-header-banner">
                <img
                    src={require('./images/menu.png')}
                    alt="Menu"
                    onClick={toggleSidebar}
                    className="home-page-menu-icon"
                />
                <h1 className="home-page-banner-title">AutoCare Connect</h1>
            </header>

            {/* Hero section */}
            <section className="home-page-hero-section">
                <div className="home-page-hero-content">
                    <img src={require('./images/logo.png')} alt="Logo" className="home-page-hero-logo" />
                    <div className="home-page-hero-description">
                        <h2>About Us</h2>
                        <p>We provide high-quality car services to keep your vehicle running smoothly.</p>
                    </div>
                </div>
            </section>

            {/* Full-width image section */}
            <section className="home-page-full-width-image">
                <img src={require('./images/picture.png')} alt="Full width" />
            </section>

            {/* Appointments banner */}
            <section className="home-page-appointments-banner">
                <h3>Some Appointments We Offer</h3>
            </section>

            {/* Alternating service sections */}
            <section className="home-page-service-section">
                <img src={require('./images/oilchange.png')} alt="Oil Change" className="home-page-service-image" />
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
                <img src={require('./images/maintenance.png')} alt="Maintenance" className="home-page-service-image" />
                <div className="home-page-service-description">
                    <h4>Maintenance</h4>
                    <p>Preventative maintenance to keep your vehicle reliable and efficient.</p>
                </div>
            </section>

            {/* Final full-width banner */}
            <section className="home-page-end-banner">
                <h3>And Much More!</h3>
            </section>

            {/* Footer */}
            <footer className="home-page-footer-banner">
                <div className="home-page-footer-description">Providing quality car management services for your convenience.</div>
                <img src={require('./images/logo.png')} alt="Logo" className="home-page-footer-logo" />
            </footer>
        </div>
    );
};

export default HomePage;
