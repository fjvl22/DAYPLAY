// routes/register.routes.js
import { Router } from 'express';
import { register } from '../controllers/users_registrations.js';

const router = Router();

router.post('/', register);

export default router;
