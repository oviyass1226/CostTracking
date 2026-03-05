const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Cost Tracking App API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes')); // Alias for singular requirement
app.use('/api/reports', require('./routes/reportRoutes'));

// Test DB Connection
db.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
