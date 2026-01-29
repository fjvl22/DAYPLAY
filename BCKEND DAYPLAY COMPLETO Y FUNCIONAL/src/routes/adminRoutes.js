import { Router } from "express";
import {
  listPendingUsers,
  approveUserCreatePayment
} from "../controllers/admin_controller.js";

import { authRequired } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/pending-users",
  authRequired,
  requireRole("ADMIN"),
  listPendingUsers
);

router.post("/approve-user/:personId",
  authRequired,
  requireRole("ADMIN"),
  approveUserCreatePayment
);

export default router;
