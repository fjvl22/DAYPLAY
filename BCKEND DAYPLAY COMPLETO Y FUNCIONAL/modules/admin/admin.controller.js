const admin = require('../../models/admin');
const adminService = require('./admin.service');

exports.getUsers = async (req, res) => {
    try {
        const data = await adminService.getUsers(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const data = await adminService.getPendingUsers(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.approvePendingUser = async (req, res) => {
    try {
        const { pendingUserId, plan } = req.body;
        const data = await adminService.approvePendingUser(req.admin, pendingUserId, plan);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.rejectPendingUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await adminService.rejectPendingUser(req.admin, id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await adminService.updateUser(req.admin, id, req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await adminService.deleteUser(req.admin, id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGames = async (req, res) => {
    try {
        const data = await adminService.getGames(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getHangmanWords = async (req, res) => {
    try {
        const data = await adminService.getHangmanWords(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getWordleWords = async (req, res) => {
    try {
        const data = await adminService.getWordleWords(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMathOperations = async (req, res) => {
    try {
        const data = await adminService.getMathOperations(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.insertGameWord = async (req, res) => {
    try {
        const data = await adminService.insertGameWord(req.admin, req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.insertMathOperation = async (req, res) => {
    try {
        const data = await adminService.insertMathOperation(req.admin, req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.canUserPlayToday = async (req, res) => {
    try {
        const { userId, gameId } = req.query;
        const data = await adminService.canUserPlayToday(req.admin, userId, gameId);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDailyRewardRequests = async (req, res) => {
    try {
        const data = await adminService.getDailyRewardRequests(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.approveDailyReward = async (req, res) => {
    try {
        const { userId, ipAddress } = req.body;
        const data = await adminService.approveDailyReward(req.admin, userId, ipAddress);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.rejectDailyReward = async (req, res) => {
    try {
        const { rewardId } = req.params;
        const data = await adminService.rejectDailyReward(req.admin, rewardId);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const data = await adminService.getPayments(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPaymentDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await adminService.getPaymentDetail(req.admin, id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const data = await adminService.getNotifications(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const data = await adminService.getEvents(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const data = await adminService.getAdmins(req.admin);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPermissionsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const data = await adminService.getPermissionsByDepartment(department);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.sendNotification = async (req, res) => {
    const { userId, title, message, type, createdBy } = req.body;
    const notification = await adminService.sendNotification(userId, title, message, type, createdBy);
    res.json(notification);
};

exports.sendNotifications = async (req, res) => {
    const { title, message, type, createdBy } = req.body;
    const notifications = await adminService.sendNotifications(title, message, type, createdBy);
    res.json(notifications);
};