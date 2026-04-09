const { Notification } = require('../models');

/**
 * Crea una notificación interna para un usuario
 * @param {Object} options
 * @param {number} options.userId
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} options.type
*/
exports.createNotification = async ({ userId, type, title, message, createdBy }) => {
    return await Notification.create({
        userId: userId,
        type: type,
        title: title,
        message: message,
        sentDate: Date.now(),
        createdBy: createdBy
    });
};