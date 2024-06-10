import express from 'express';
import { registerUser, loginUser, authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/currentUser', authenticateToken, (req, res) => {
    res.status(200).send(req.user);
});


router.put('/updateProfile', authenticateToken, async (req, res) => {
    const { email, username, museum, phone } = req.body;
    const { email: userEmail } = req.user;

    try {
        db.query(
            "UPDATE users SET email = ?, username = ?, museum = ?, phone = ? WHERE email = ?",
            [email, username, museum, phone, userEmail],
            (err) => {
                if (err) {
                    res.status(400).send({ error: "An error occurred during the update." });
                } else {
                    res.status(200).send({ message: "Profile updated successfully!" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
});

export default router;
