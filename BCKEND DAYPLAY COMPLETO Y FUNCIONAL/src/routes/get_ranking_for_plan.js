// routes/ranking.routes.js
import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { requireNotPending } from '../middlewares/status.middleware.js';
import { checkActivePlan } from '../middlewares/plan.middleware.js';
import { requireAppUser } from '../middlewares/ranking.middleware.js';
import { getRankingByGame } from '../controllers/get_ranking_for_plan.js';

const router = Router();

router.get(
  '/',
  authRequired,
  requireNotPending,
  requireAppUser,
  checkActivePlan,
  getRankingByGame
);

export default router;