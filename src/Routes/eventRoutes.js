import express from 'express';
import { addEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../Controllers/eventController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, addEvent);
router.get('/', authenticateToken, getEvents);
router.get('/:id', authenticateToken, getEventById);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
