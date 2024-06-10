import express from 'express';
import { registerUser, loginUser, authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/currentUser', authenticateToken, (req, res) => {
    res.status(200).send(req.user);
});

export default router;
