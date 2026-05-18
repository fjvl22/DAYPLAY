const jwtService = require('./jwt.service');

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const result = await jwtService.refreshAccessToken(refreshToken);

        res.json(result);
    } catch (error) {
        next(error);
    }
};