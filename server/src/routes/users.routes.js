import { Router } from 'express';
import { updateProfile } from '../controllers/users.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.put('/profile', updateProfile);

export default router;
