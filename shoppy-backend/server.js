require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const errorHandler = require('./middleware/errorHandler'); 

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Sync (Creates tables if they don't exist)
db.sequelize.sync().then(() => {
    console.log("Database synced successfully.");
}).catch((err) => {
    console.error("Failed to sync database:", err.message);
});

// Redis Connection
require('./config/redis.config').checkConnection();

// Routes
require('./routes/auth.routes')(app);
require('./routes/product.routes')(app);
require('./routes/order.routes')(app);
require('./routes/cart.routes')(app); // <--- FIX: Cart routes now registered

app.get('/', (req, res) => res.status(200).send({ message: "Shoppy API is running." }));

// Centralized Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});