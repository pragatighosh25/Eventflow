import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getActivity,
  getEvent,
  listEvents,
  markEventFinished,
  registerForEvent,
  updateEvent,
} from '../controllers/events.controller.js';
import { protect, requireAttendee, requireOrganizer } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/activity', getActivity);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', requireOrganizer, createEvent);
router.put('/:id', requireOrganizer, updateEvent);
router.delete('/:id', requireOrganizer, deleteEvent);
router.patch('/:id/finish', requireOrganizer, markEventFinished);
router.post('/:id/register', requireAttendee, registerForEvent);

export default router;
