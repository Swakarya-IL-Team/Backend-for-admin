import express from 'express';
import { registerUser, loginUser, updateProfile } from '../Controllers/authController.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/currentUser', authenticateToken, (req, res) => {
    res.status(200).send(req.user);
});

router.put('/updateProfile', authenticateToken, updateProfile);

export default router;
