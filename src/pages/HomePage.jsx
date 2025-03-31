import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to Expense Tracker</h1>
                <p>Manage your expenses efficiently and keep track of your spending habits.</p>
            </div>

            <div className="features-section">
                <h2>Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Transactions</h3>
                        <p>View and manage all your transactions in one place.</p>
                        <Link to="/transactions" className="feature-link">
                            Go to Transactions
                        </Link>
                    </div>

                    <div className="feature-card">
                        <h3>Categories</h3>
                        <p>Organize your expenses by categories for better tracking.</p>
                        <Link to="/categories" className="feature-link">
                            Go to Categories
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage; 