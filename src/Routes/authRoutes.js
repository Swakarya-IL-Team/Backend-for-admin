import express from 'express';
import { registerUser, loginUser, updateProfile, sendResetCode, verifyResetCode, resetPassword } from '../Controllers/authController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';
import { upload } from '../Middleware/Multer.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sendResetCode', sendResetCode);
router.post('/verifyResetCode', verifyResetCode);
router.post('/resetPassword', resetPassword);

router.get('/currentUser', authenticateToken, (req, res) => {
    res.status(200).send(req.user);
});

// Use Multer middleware for handling file uploads
router.put('/updateProfile', authenticateToken, upload.single('picture_profile'), updateProfile);

export default router;
