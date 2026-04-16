const config = require('./config');

require('./cronJobs/dailyRewardCron');
require('./cronJobs/storyAccessExpiration');

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const paymentService = require('./services/payment.service');

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

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} 🚀`);
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
