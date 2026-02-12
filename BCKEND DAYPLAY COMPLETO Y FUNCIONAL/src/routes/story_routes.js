// src/routes/admin.story.routes.js
import { Router } from 'express';
import {
  getPendingRequests,
  approveChapter,
  rejectChapter
} from '../controllers/admin_controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * ADMIN
 * Ver solicitudes pendientes
 */
router.get(
  '/story/pending',
  authRequired,
  getPendingRequests
);

/**
 * ADMIN
 * Aprobar capítulo diario
 */
router.post(
  '/story/approve',
  authRequired,
  approveChapter
);

/**
 * ADMIN
 * Rechazar capítulo diario
 */
router.post(
  '/story/reject',
  authRequired,
  rejectChapter
);

export default router;
