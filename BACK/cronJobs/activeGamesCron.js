const cron = require('node-cron');
const { UserGame } = require('../models');

// Cada día a las 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        await UserGame.update(
            { active: true },
            { where: {} }
        );

        console.log('[CRON] UserGame reseteado: todos activos');
    } catch (err) {
        console.error('[CRON] Error reseteando UserGame:', err);
    }
});