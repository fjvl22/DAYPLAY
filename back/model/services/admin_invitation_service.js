const crypto = require('crypto');
const bcrypt = require('bcrypt');

const AdminInvitation = require('../entities/admin_invitation');
const RegistrationPending = require('../entities/registration_pending');

const EmailService = require('./email_service');
const AppError = require('../errors/AppError');

class AdminInvitationService {

    async createInvitation(email, adminId) {

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const expiresAt = new Date(Date.now()+24*60*60*1000);

        const invitation = await AdminInvitation.create({ email, tokenHash, expiresAt, used: false, createdBy: adminId });

        const invitationURL = `${process.env.FRONT_URL}/admin-register?token=${token}`;

        await EmailService.sendAdminInvitation(email, invitationURL);

        return { id: invitation.id, email: invitation.email, expiresAt: invitation.expiresAt };
    }

    async validateInvitation(token) {

        if (!token) throw new AppError("Invitation required", 400);

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const invitation = await AdminInvitation.findOne({ where: tokenHash, used: false });

        if (!invitation) throw new AppError("Invalid invitation", 400);

        if (new Date() > invitation.expiresAt) throw new AppError("Invitation has expired", 400);

        return { valid: true, email: invitation.email };
    }

    async registerAdmin(data) {

        const { token, nickname, password, email } = data;

        if (!token) throw new AppError("Invitation required", 400);

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const invitation = await AdminInvitation.findOne({ where: { tokenHash, used: false } });

        if (!invitation) throw new AppError("Invalid invitation", 400);

        if (new Date() > invitation.expiresAt) throw new AppError("Invitation has expired", 400);

        const passwordHash = await bcrypt.hash(password, 10);

        const confirmationToken = crypto.randomBytes(32).toString("hex");

        const confirmationTokenHash = crypto.createHash("sha256").update(confirmationToken).digest("hex");

        const confirmationExpiresAt = new Date(Date.now()+24*60*60*1000);
        
        await RegistrationPending.create({ email: invitation.email, nickname, passwordHash, personType: "ADMIN", invitationId: invitation.id, tokenHash: confirmationTokenHash, expiresAt: confirmationExpiresAt, used: false });

        const confirmationURL = `${process.env.FRONT_URL}/confirm-registration?token=${confirmationToken}`;

        await EmailService.sendRegistrationConfirmation(invitation.email, confirmationURL);

        return { message: "An email has been sent to confirm your email address." };
    }
}

module.exports = new AdminInvitationService();