const bcrypt = require('bcrypt');

const Person = require('../entities/Person');
const JWTService = require('./jwt_service');

const AppError = require('../../errors/AppError');

class AuthService {

    async login(nickname, password, rememberMe = false) {

        if (!nickname || !password) throw new AppError('Nickname and password are required', 400);

        const person = await Person.findOne({ where: { nickname } });

        if (!person) throw new AppError('Invalid nickname or password', 401);

        if (!person.active) throw new AppError('The account is inactive', 403);

        const validPassword = await bcrypt.compare(password, person.passwordHash);

        if (!validPassword) throw new AppError('Invalid nickname or password', 401);

        const accessToken = JWTService.generateAccessToken(person);

        const refreshToken = JWTService.generateRefreshToken(person, rememberMe);

        return { accessToken, refreshToken, person: { id: person.id, nickname: person.nickname, email: person.email, personType: person.personType } };
    }

    async logout(refreshToken) {

        if (!refreshToken) throw new AppError('Refresh token is required', 400);

        await JWTService.blacklistRefreshToken(refreshToken);

        return { message: 'Logout successful' };
    }

    async changePassword(personId, currentPassword, newPassword) {

        const person = await Person.findByPk(personId);

        if (!person) throw new AppError('User not found', 404);

        const validPassword = await bcrypt.compare(currentPassword, person.passwordHash);

        if (!validPassword) throw new AppError('The current password is incorrect.', 401);

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await person.update({ passwordHash: newPasswordHash });

        return { message: 'Password successfully changed' };
    }

    async deleteAccount(personId) {

        const person = await Person.findByPk(personId);

        if (!person) throw new AppError('User not found', 404);

        await person.destroy();

        return { message: 'Account successfully deleted' };
    }
}

module.exports = new AuthService();