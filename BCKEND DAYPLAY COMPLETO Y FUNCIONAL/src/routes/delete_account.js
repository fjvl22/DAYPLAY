import { Router } from 'express';
import { deleteAccount } from '../controllers/delete_account.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

router.delete('/', authRequired, deleteAccount);

export default router;