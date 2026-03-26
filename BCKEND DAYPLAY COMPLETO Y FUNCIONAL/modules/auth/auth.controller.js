const authService = require('./auth.service');
exports.login = async (req, res, next) => {
    try {
        const { nickname, password } = req.body;
        const token = await authService.login(nickname, password);
        res.json({ token });
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
exports.logout = async (req, res, next) => {
    try {
        const result = await authService.logout(req.token);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
exports.deleteAccount = async (req, res, next) => {
    try {
        const result = await authService.deleteAccount(req.user.id, req.body.password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await authService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
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