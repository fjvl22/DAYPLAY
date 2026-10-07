const crypto = require('crypto');

const bcrypt = require('bcrypt');

const RegistrationPending = require('../../model/entities/RegistrationPending');

const Person = require('../../model/entities/Person');

const PendingUser = require('../../model/entities/PendingUser');

const Admin = require('../../model/entities/Admin');

const sequelize = require('../../bd/bd');

const AppError = require('../../errors/AppError');

class RegistrationService {

    async confirmRegistration(token) {

        if (!token) throw new AppError("Confirmation token required", 400);

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const pending = await RegistrationPending.findOne({ where: { tokenHash, used: false } });

        if (!pending) throw new AppError("Invalid confirmnation link", 400);

        if (new Date()>pending.expiresAt) throw new AppError("The confirmation link has expired", 400);

        const transaction = await sequelize.transaction();

        try {

            const person = await Person.create(
                {
                    nickname: pending.nickname,
                    email: pending.email,
                    passwordHash: pending.passwordHash,
                    active: true,
                    personType: pending.personType
                },
                {
                    transaction
                }
            );

            if (pending.personType === "USER") {

                await PendingUser.create(
                    {
                        personId: person.id,
                        planId: pending.planId
                    },
                    {
                        transaction
                    }
                );
            }

            if (pending.personType === "ADMIN") {

                await Admin.create(
                    {
                        personId: person.id,
                        department: pending.department
                    },{
                        transaction
                    }
                )
            }

            await pendinbg.update(
                {
                    used: true
                },
                {
                    transaction
                }
            );

            await transaction.commit();

            return { message: 'Account correctly created' };

        } catch (error) {

            await transaction.rollback();

            throw error;
        }
    }
}

module.exports = new RegistrationService();