const cron = require('node-cron');
const { StoryAccess } = require('../models');
const { Person } = require('../models');
const { AppUser } = require('../models');
const { UserPlan } = require('../models');
const { SystemEvent } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notification.service');
const { sendEmail } = require('../services/email.service');

const expireStoryAccess = async () => {
    try {
        const now = new Date();
        const expiredAccesses = await StoryAccess.findAll({
            where: {
                accessGranted: true,
                revokeDate: {
                    [Op.lte]: now
                }
            },
            include: [
                {
                    model: AppUser,
                    include: [UserPlan]
                }
            ]
        });
        for (const access of expiredAccesses) {
            const user = await AppUser.findByPk(access.userId);
            if (!user || user.planId?.type !== 'BASIC') continue;
            access.accessGranted = false;
            await access.save();
            await createNotification({
                userId: user.id,
                title: 'Tu acceso al capítulo diario ha expirado',
                type: 'DAILY_REWARD_EXPIRED'
            });
            const person = await Person.findByPk(user.personId);
            await sendEmail({
                to: person.email,
                subject: 'Tu capítulo diario ha expirado',
                html: `
                    <h3>Hola ${person.nickname}</h3>
                    <p>Tu acceso al capítulo diario ha expirado al finalizar el día.</p>
                    <p>Si quieres acceso permanente, puedes actualizar a plan Premium.</p>
                `
            });
            await SystemEvent.create({
                adminId: null,
                userId: user.personId,
                eventType: 'DAILY_REWARD_EXPIRED',
                description: 'Acceso expirado automáticamente por plan BASIC',
                category: 'SYSTEM',
                ipAddress: null
            });
        }
        console.log(`Expired access processed: ${expiredAccesses.length}`);
    } catch (error) {
        console.error('Error expiring story access: ', error);
    }
};

cron.schedule('0 0 * * *', () => {
    console.log('Running daily story access expiration job...');
    expireStoryAccess();
});