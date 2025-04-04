import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { transactionService } from '../../Services/transactionService';
import './TransactionChart.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TransactionChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Amount Spent',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',   // Pink
                'rgba(54, 162, 235, 0.7)',   // Blue
                'rgba(255, 206, 86, 0.7)',   // Yellow
                'rgba(75, 192, 192, 0.7)',   // Teal
                'rgba(153, 102, 255, 0.7)',  // Purple
                'rgba(255, 159, 64, 0.7)'    // Orange
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            maxBarThickness: 80
        }]
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalSpending, setTotalSpending] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch both chart data and total amount
                const [chartResponse, totalResponse] = await Promise.all([
                    transactionService.getTransactionsByCategory(),
                    transactionService.getTotalAmount()
                ]);

                if (chartResponse && Array.isArray(chartResponse)) {
                    const labels = chartResponse.map(item => item.category);
                    const data = chartResponse.map(item => item.amountSpent);

                    setChartData(prev => ({
                        labels: labels,
                        datasets: [{
                            ...prev.datasets[0],
                            data: data
                        }]
                    }));
                } else {
                    throw new Error('Invalid chart data format');
                }

                if (totalResponse && typeof totalResponse.totalSpending === 'number') {
                    setTotalSpending(totalResponse.totalSpending);
                } else {
                    throw new Error('Invalid total amount format');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    },
                    padding: 20,
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            title: {
                display: true,
                text: 'Expenses by Category',
                font: {
                    size: 24,
                    weight: '500',
                    family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                },
                padding: {
                    top: 20,
                    bottom: 30
                },
                color: '#2c3e50'
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#2c3e50',
                bodyColor: '#2c3e50',
                bodyFont: {
                    size: 14
                },
                borderColor: '#e1e1e1',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return `Amount: $${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 13,
                        family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    },
                    padding: 10,
                    callback: function(value) {
                        return '$' + value;
                    }
                },
                title: {
                    display: true,
                    text: 'Amount ($)',
                    font: {
                        size: 16,
                        weight: '500',
                        family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    },
                    padding: { bottom: 15 },
                    color: '#2c3e50'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 13,
                        family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    },
                    padding: 10
                },
                title: {
                    display: true,
                    text: 'Category',
                    font: {
                        size: 16,
                        weight: '500',
                        family: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
                    },
                    padding: { top: 15 },
                    color: '#2c3e50'
                }
            }
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 0,
                bottom: 0
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };

    if (loading) {
        return <div className="chart-loading">Loading data...</div>;
    }

    if (error) {
        return <div className="chart-error">{error}</div>;
    }

    return (
        <div className="chart-container">
            <div className="transaction-chart">
                <Bar data={chartData} options={options} />
            </div>
            <div className="total-spending">
                <h3>Total Spending</h3>
                <p className="amount">${totalSpending.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default TransactionChart; 