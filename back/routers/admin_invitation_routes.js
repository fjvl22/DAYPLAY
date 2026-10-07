const express = require('express');

const router = express.Router();

const controller = require('../controllers/admin_invitation_controller');

const auth = require('../middlewares/auth');

const role = require('../middlewares/role');

const type = require('../middlewares/admin_type');

router.post("/", auth, role("ADMIN"), type("SUPREME"), controller.createInvitation);

router.get("/:token", controller.validateInvitation);

router.post("/register", controller.registerAdmin);

module.exports = router;