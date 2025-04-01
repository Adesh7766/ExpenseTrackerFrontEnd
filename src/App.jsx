import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import StatusesPage from './pages/StatusesPage';
import UserPage from './pages/UserPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/statuses" element={<StatusesPage />} />
                        <Route path="/users" element={<UserPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App; 