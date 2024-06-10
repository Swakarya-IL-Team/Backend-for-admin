import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';  

const jwtSecret = "secret";  

// Register a new user
export const registerUser = async (req, res) => {
    const { email, username, password, museum, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (email, username, password, museum, phone) VALUES (?, ?, ?, ?, ?)",
            [email, username, hashedPassword, museum, phone],
            (err) => {
                if (err) {
                    res.status(400).send({ error: "An error occurred during registration." });
                } else {
                    res.status(201).send({ message: "User registered successfully!" });
                }
            }
        );
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
};

// Login user, menampilkan token email, dan username
export const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                res.status(400).send({ error: "An error occurred during login." });
            } else if (result.length === 0) {
                res.status(400).send({ error: "Invalid email or password." });
            } else {
                const user = result[0];

                const validPassword = await bcrypt.compare(password, user.password);

                if (validPassword) {
                    const token = jwt.sign({ email: user.email, username: user.username, password: user.password }, jwtSecret);

                    res.status(200).send({ token });
                } else {
                    res.status(400).send({ error: "Invalid email or password." });
                }
            }
        }
    );
};
