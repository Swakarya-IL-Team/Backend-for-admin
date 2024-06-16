import express from 'express';
import {
    addMuseumInfo,
    getMuseumInfo,
    getMuseumInfoById,
    updateMuseumInfo,
    deleteMuseumInfo
} from '../Controllers/museuminfoController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';
import { upload } from '../Middleware/Multer.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('museum_picture'), addMuseumInfo);
router.get('/', authenticateToken, getMuseumInfo);
router.get('/:id', authenticateToken, getMuseumInfoById);
router.put('/:id', authenticateToken, upload.single('museum_picture'), updateMuseumInfo);
router.delete('/:id', authenticateToken, deleteMuseumInfo);


export default router;
