import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendEmail(to, subject, text, html){
    try{
        await transporter.sendMail({
            from: `"DAYPLAY <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log(`V Correo enviado a ${to} con asunto: "${subject}"`);
    }catch(error){
        console.error('X Error al enviar correo: ', error);
        throw error;
    }
}

export default sendEmail;