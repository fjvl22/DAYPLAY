const service = require('./admin.service');

const getAdmin = (req) => req.context.admin;

exports.getUsers = async (req, res) => {
    try {
        const data = await service.getUsers();
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const data = await service.getPendingUsers();
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.approvePendingUser = async (req, res) => {
    try {
        const data = await service.approvePendingUser(
            getAdmin(req),
            req.body.pendingUserId,
            req.body.plan
        );
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.rejectPendingUser = async (req, res) => {
    try {
        const data = await service.rejectPendingUser(req.params.id, getAdmin(req).personId);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const data = await service.updateUser(req.params.id, req.body, getAdmin(req).personId);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const data = await service.deleteUser(req.params.id, getAdmin(req).personId);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getGames = async (req, res) => {
    res.json(await service.getGames());
};

exports.getHangmanWords = async (req, res) => {
    res.json(await service.getHangmanWords());
};

exports.getWordleWords = async (req, res) => {
    res.json(await service.getWordleWords());
};

exports.getMathOperations = async (req, res) => {
    res.json(await service.getMathOperations());
};

exports.insertGameWord = async (req, res) => {
    res.json(await service.insertGameWord({...req.body, adminId: getAdmin(req).personId}));
};

exports.insertMathOperation = async (req, res) => {
    res.json(await service.insertMathOperation({...req.body, adminId: getAdmin(req).personId}));
};

exports.getRewards = async (req, res) => {
    try {
        const sortByDate = req.query.sortByDate === 'true';
        const sortByScore = req.query.sortByScore === 'true';
        const data = await service.getRewards({sortByDate, sortByScore});
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.approveReward = async (req, res) => {
    try {
        const { userId } = req.params;
        const chapter = await service.approveReward(Number(userId), getAdmin(req).personId);
        res.json(chapter);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.rejectReward = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await service.rejectReward(Number(userId), getAdmin(req).personId);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const data = await service.getAllEvents(req.query);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getAdmins = async (req, res) => {
    res.json(await service.getAdmins());
};

exports.getPermissionsByDepartment = async (req, res) => {
    res.json(await service.getPermissionsByDepartment(req.params.department));
};

exports.getAllPayments = async (req, res) => {
    try {
        const data = await service.getPayments();
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.messgae });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const data = await service.getPaymentById(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.getPaymentTraces = async (req, res) => {
    try {
        const data = await service.getPaymentTraces(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.sendToUser = async (req, res) => {
    try {
        const data = await service.sendToUser({...req.body, createdBy: getAdmin(req).personId});
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.sendToAllUsers = async (req, res) => {
    try {
        const data = await service.sendToAllUsers({...req.body, createdBy: req.user.personId});
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};