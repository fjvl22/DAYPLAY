const adminService = require('./admin.service');


/* =========================
   USERS
========================= */

exports.getUsers = async (req, res) => {
    try {
        const users = await adminService.getUsers(req.admin);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await adminService.updateUser(
            req.admin,
            req.params.id,
            req.body
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await adminService.deleteUser(req.admin, req.params.id);
        res.json({ message: 'User correctly deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   PENDING USERS
========================= */

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await adminService.getPendingUsers(req.admin);
        res.json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approvePendingUser = async (req, res) => {
    try {
        const { plan } = req.body; // ahora viene del body correctamente

        const result = await adminService.approvePendingUser(
            req.admin,
            req.params.id,
            plan
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectPendingUser = async (req, res) => {
    try {
        const result = await adminService.rejectPendingUser(
            req.admin,
            req.params.id
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   GAMES
========================= */

exports.getGames = async (req, res) => {
    try {
        const games = await adminService.getGames(req.admin);
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGame = async (req, res) => {
    try {
        const game = await adminService.createGame(req.admin, req.body);
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateGame = async (req, res) => {
    try {
        const game = await adminService.updateGame(
            req.admin,
            req.params.id,
            req.body
        );
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        await adminService.deleteGame(req.admin, req.params.id);
        res.json({ message: 'Game correctly deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getActiveGames = async (req, res) => {
    try {
        await adminService.getActiveGames(req.admin, req.params.id);
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   DAILY REWARDS
========================= */

exports.getDailyRewardRequests = async (req, res) => {
    try {
        const requests = await adminService.getDailyRewardRequests(req.admin);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveDailyReward = async (req, res) => {
    try {
        const result = await adminService.approveDailyReward(
            req.admin,
            req.params.userId,
            req.ip
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectDailyReward = async (req, res) => {
    try {
        const result = await adminService.rejectDailyReward(
            req.admin,
            req.params.id
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   PAYMENTS
========================= */

exports.getPayments = async (req, res) => {
    try {
        const payments = await adminService.getPayments(req.admin);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentDetail = async (req, res) => {
    try {
        const details = await adminService.paymentDetail(req.admin, req.paymentId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   NOTIFICATIONS
========================= */

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await adminService.getNotifications(req.admin);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   EVENTS
========================= */

exports.getEvents = async (req, res) => {
    try {
        const events = await adminService.getEvents(req.admin);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* =========================
   ADMINS
========================= */

exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAdmins(req.admin);
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};