const jwt = require('jsonwebtoken');

const TokenBlacklist = require('../entities/TokenBlacklist');

const AppError = require('../../errors/AppError');

class JWTService {

    generateAccessToken(person) {

        return jwt.sign(
            {
                id: person.id,
                nickname: person.nickname,
                personType: person.personType
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '1h'
            }
        );
    }

    generateRefreshToken(person, rememberMe = false) {

        return jwt.sign(
            {
                id: person.id
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: rememberMe ? '7d' : '1d'
            }
        );
    }

    verifyAccessToken(token) {

        try {

            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        } catch (error) {

            throw new AppError('Invalid or expired access token', 401);
        }
    }

    async verifyRefreshToken(token) {

        try {

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });

            if (blacklistedToken) throw new AppError('Refresh token has been revoked', 401);

            return decoded;

        } catch (error) {

            if (error instanceof AppError) throw error;

            throw new AppError('Invalid or expired refresh token', 401);
        }
    }

    async blacklistRefreshToken(token) {

        try {

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            const existingToken = await TokenBlacklist.findOne({ where: { token } });

            if (existingToken) return;

            await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp*1000) });

        } catch (error) {

            if (error.name === 'TokenExpiredError') return;

            if (error instanceof AppError) throw error;

            throw new AppError('Invalid refresh token', 401);
        }
    }
}

module.exports = new JWTService();