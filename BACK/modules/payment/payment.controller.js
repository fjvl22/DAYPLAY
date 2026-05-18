const service = require('./payment.service');

async function createIntent(req, res) {
    try {
        const { userId, adminId, amount } = req.body;

        const result = await service.chargeUser(userId, adminId, amount);

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createIntent };