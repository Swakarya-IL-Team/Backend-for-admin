import express from 'express';
import { addCmsEntry, getCmsEntries, updateCmsEntry, deleteCmsEntry } from '../Controllers/cmsController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, addCmsEntry);
router.get('/', authenticateToken, getCmsEntries);
router.put('/:id', authenticateToken, updateCmsEntry);
router.delete('/:id', authenticateToken, deleteCmsEntry);

export default router;
