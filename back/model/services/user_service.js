const crypto = require('crypto');
const bcrypt = require('bcrypt');

const RegistrationPending = require('../entities/RegistrationPending');

const Person = require('../entities/Person');

const AppError = require('../../errors/AppError');

const EmailService = require('./email_service');

class UserService {

    async register(data) {

        const { nickname, email, password, planId } = data;

        if (!nickname || !email || !password || !planId) throw new AppError("All fields are required", 400);

        const existingPerson = await Person.findOne({ where: { email } });

        if (existingPerson) throw new AppError("This email is already register", 409);

        const existingPending = await RegistrationPending.findOne({ where: { email, used: false } });

        if (existingPending) throw new AppError("There is already a pending registration for this email", 409);

        const passwordHash = await bcrypt.hash(password, 10);

        const confirmationToken = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto.createHash("sha256").update(confirmationToken).digest("hex");

        const expiresAt = new Date(Date.now()+24*60*60*1000);

        await RegistrationPending.create({
            email,
            nickname,
            passwordHash,
            personType: "USER",
            planId,
            invitationId: null,
            tokenHash,
            expiresAt,
            used: false
        });

        const confirmationURL = `${process.env.FRONT_URL}/confirm-registration?token=${confirmationToken}`;

        await EmailService.sendRegistrationConfirmation(email, confirmationURL);

        return { message: "An email has been sent to confirm your email address." };
    }
}