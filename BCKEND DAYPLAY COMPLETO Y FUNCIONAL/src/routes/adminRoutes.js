import express from 'express';
import multer from 'multer';
import {
  listPendingUsers,
  approveUser,
  uploadCardPhotos,
  createStripePayment
} from '../controllers/admin_controller.js';

import { authRequired } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Todos los endpoints ADMIN requieren JWT + rol ADMIN
router.use(authRequired);
router.use(requireRole("ADMIN"));

// Usuarios pendientes
router.get('/pending-users', listPendingUsers);

// Aprobar usuario
router.post('/approve-user/:id', approveUser);

// Subir fotos de tarjeta
router.post(
  '/upload-card/:userId',
  upload.fields([{ name: 'cardFront', maxCount: 1 }, { name: 'cardBack', maxCount: 1 }]),
  uploadCardPhotos
);

// Crear pago
router.post('/create-payment/:userId', createStripePayment);

export default router;
