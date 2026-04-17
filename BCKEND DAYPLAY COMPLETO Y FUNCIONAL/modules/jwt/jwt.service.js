const jwt = require('jsonwebtoken');
const { TokenBlacklist } = require('../../models');

exports.generateTokens = (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

exports.verifyAccessToken = (token) => {return jwt.verify(token, process.env.JWT_ACCESS_SECRET);}

exports.verifyRefreshToken = (token) => {return jwt.verify(token, process.env.JWT_REFRESH_SECRET);}

exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('No refresh token');

    try {
        const decoded = exports.verifyRefreshToken(refreshToken);

        const exists = await TokenBlacklist.findOne({ where: { token: refreshToken } });

        if (!exists) throw new Error('Invalid refresh token');

        const newAccessToken = jwt.sign(
            {
                id: decoded.id,
                role: decoded.role,
                nickname: decoded.nickname
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        return { accessToken: newAccessToken };

    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};