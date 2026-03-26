const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * @param {Object} options
 * @param {string} options.to - Email del destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido HTML
*/
exports.sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"DAYPLAY" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
};