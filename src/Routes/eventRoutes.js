import express from 'express';
import { addEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../Controllers/eventController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';
import { upload } from '../Middleware/Multer.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('event_picture'), addEvent);
router.get('/', authenticateToken, getEvents);
router.get('/:id', authenticateToken, getEventById);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
