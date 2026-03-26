const cron = require('node-cron');
const adminService = require('./modules/admin/admin.service');
const DailyGameReward = require('./models/dailyGameReward');
cron.schedule('0 0 * * *', async () => {
    console.log('Running automated daily review of DailyGameReward...');
    const rewards = await DailyGameReward.findAll();
    for (const reward of rewards) {
        try {
            await adminService.approveDailyReward(
                { adminType: 'GAME_ADMIN', id: 1 },
                reward.userId
            );
        } catch (err) {
            console.error('Error processing reward of userId', reward.userId, err.message);
        }
    }
    console.log('DailyGameReward automated process completed.');
});