require('dotenv').config();
require('./scheduler'); // si usas cron
require('./cronJobs/dailyRewardCron');
require('./cronJobs/storyAccessExpiration');

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const config = require('./config');
const paymentService = require('./payment/payment.service')(config.STRIPE_SECRET_KEY);

console.log(`🚀 Entorno: ${config.ENV}`);
console.log('📌 Variables de entorno cargadas:');
console.log('PORT:', config.PORT);
console.log('DB_NAME:', config.DB_NAME);
console.log('DB_USER:', config.DB_USER);
console.log('DB_PASS:', config.DB_PASS);
console.log('DB_HOST:', config.DB_HOST);
console.log('JWT_SECRET:', config.JWT_SECRET);
console.log('EMAIL_USER:', config.EMAIL_USER);
console.log('EMAIL_PASS:', config.EMAIL_PASS);

// Aquí arrancaría tu servidor usando config.PORT

const adminRoutes = require('./modules/admin/admin.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');

const app = express();

/* ================================
   MIDDLEWARES
================================ */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   ROUTES
================================ */

app.get('/', (req, res) => {
    res.json({ message: 'API running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error'
    });
});

/* ================================
   SERVER + DATABASE START
================================ */

const PORT = config.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected ✅');

        await sequelize.sync(); // en producción usa migrations

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} 🚀`);
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
