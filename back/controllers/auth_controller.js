const authService = require('../model/services/auth_service');

class AuthController {

    async login(req, res, next) {

        try {

            const { nickname, password, rememberMe } = req.body;

            const result = await authService.login(nickname, password, rememberMe);

            res.status(200).json(result);

        } catch (error) { next(error); }
    }

    async logout(req, res, next) {

        try {

            const { refreshToken } = req.body;

            const result = await authService.logout(refreshToken);

            res.status(200).json(result);

        } catch (error) { next(error); }
    }
}

module.exports = new AuthController();