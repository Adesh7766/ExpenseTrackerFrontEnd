import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Expense Tracker</Link>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/" className={isActive('/')}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/transactions" className={isActive('/transactions')}>
                        Transactions
                    </Link>
                </li>
                <li>
                    <Link to="/categories" className={isActive('/categories')}>
                        Categories
                    </Link>
                </li>
                <li>
                    <Link to="/statuses" className={isActive('/statuses')}>
                        Statuses
                    </Link>
                </li>
                <li>
                    <Link to="/users" className={isActive('/users')}>
                        Users
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar; 