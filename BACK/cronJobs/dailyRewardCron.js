const cron = require('node-cron');
const { DailyGameReward } = require('../models');
const { approveDailyReward } = require('../modules/admin/admin.service');
const { Admin } = require('../models');

cron.schedule('0 0 * * *', async () => {
    console.log('Running daily reward auto-approval...');
    try {
        const pendingRewards = await DailyGameReward.findAll();
        if (!pendingRewards.length) {
            console.log('No pending rewards');
            return;
        }
        const systemAdmin = await Admin.findOne({ where: { department: 'GAME' } });
        if (!systemAdmin) {
            console.error('No game admin found for auto-approval');
            return;
        }
        for (const reward of pendingRewards) {
            try {
                await approveDailyReward(systemAdmin, reward.userId);
            } catch (error) {
                console.error(`Error processing user ${reward.userId}: `, error.message);
            }
        }
    } catch (error) {
        console.error('Cron job error: ', error.message);
    }
});