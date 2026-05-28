const config = require('./config');

require('./cronJobs/dailyRewardCron');
require('./cronJobs/storyAccessExpiration');

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const adminRoutes = require('./modules/admin/admin.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const jwtRoutes = require('./modules/jwt/jwt.routes');

const app = express();

app.use(cors());

// ESTO TIENE QUE IR ANTES DE LAS RUTAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'API running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jwt', jwtRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error'
    });
});

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