import { Router } from 'express';
import {
  getRecommendations,
  postEventCopy,
  postRegistrationFields,
} from '../controllers/ai.controller.js';
import { protect, requireAttendee, requireOrganizer } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/event-copy', requireOrganizer, postEventCopy);
router.post('/registration-fields', requireOrganizer, postRegistrationFields);
router.get('/recommendations', requireAttendee, getRecommendations);

export default router;
