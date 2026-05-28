const authService = require('./auth.service');

exports.login = async (req, res, next) => {

    try {
        const { nickname, password, rememberMe } = req.body;
        const tokens = await authService.login(nickname, password, rememberMe);
        res.json(tokens);
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.body.refreshToken;

        const result = await authService.logout(accessToken, refreshToken);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.adminRegistration = async (req, res, next) => {
    try {
        const result = await authService.adminRegistration(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.userRegistration = async (req, res, next) => {
    try {
        const result = await authService.userRegistration(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        const result = await authService.deleteAccount(
            req.user.personId,
            req.body.password
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const result = await authService.changePassword(
            req.user.personId,
            req.body.currentPassword,
            req.body.newPassword
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getPlanTypes = async (req, res, next) => {
    try {
        const types = await authService.getPlanTypes();
        res.json(types);
    } catch (error) {
        next(error);
    }
};