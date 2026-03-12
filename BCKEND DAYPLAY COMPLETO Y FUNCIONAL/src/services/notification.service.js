const Notification = require('../models/notification');

/**
 * Crea una notificación interna para un usuario
 * @param {Object} options
 * @param {number} options.userId
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} options.type
*/
exports.createNotification = async ({ userId, title, message, type }) => {
    return await Notification.create({
        userId, title, message, type, read: false
    });
};