const jwt = require('jsonwebtoken');
const { TokenBlacklist } = require('../../models');

exports.generateTokens = (payload, rememberMe) => {

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: rememberMe ? '7d' : '1d' });

    return { accessToken, refreshToken };
};

exports.verifyAccessToken = (token) => {return jwt.verify(token, process.env.JWT_ACCESS_SECRET);};

exports.verifyRefreshToken = (token) => {return jwt.verify(token, process.env.JWT_REFRESH_SECRET);};

exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('No refresh token');

    const decoded = exports.verifyRefreshToken(refreshToken);

    const exists = await TokenBlacklist.findOne({ where: { token: refreshToken } });
    if (!exists) throw new Error('Invalid refresh token');

    await TokenBlacklist.destroy({ where: { token: refreshToken } });

    const newTokens = exports.generateTokens(
        {
            personId: decoded.personId,
            role: decoded.role,
            nickname: decoded.nickname
        },
        true
    );

    await TokenBlacklist.create({
        token: newTokens.refreshToken,
        expiresAt: new Date(Date.now()+7*24*60*60*1000)
    });

    return newTokens;
};