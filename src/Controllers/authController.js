import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import nodemailer from 'nodemailer';

const jwtSecret = "secret";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

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
                    const token = jwt.sign({ email: user.email, username: user.username }, jwtSecret);

                    res.status(200).send({ token });
                } else {
                    res.status(400).send({ error: "Invalid email or password." });
                }
            }
        }
    );
};

export const updateProfile = async (req, res) => {
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
};

// New: Forgot Password Logic
export const sendResetCode = async (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred." });
        } else if (result.length === 0) {
            res.status(400).send({ error: "No user found with this email." });
        } else {
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();  // generate 6-digit code

            db.query("UPDATE users SET reset_code = ? WHERE email = ?", [resetCode, email], async (err) => {
                if (err) {
                    res.status(400).send({ error: "An error occurred." });
                } else {
                    const mailOptions = {
                        from: 'your-email@gmail.com',
                        to: email,
                        subject: 'Password Reset Code',
                        text: `Your password reset code is: ${resetCode}`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.status(500).send({ error: "Failed to send email." });
                        } else {
                            res.status(200).send({ message: "Reset code sent successfully!" });
                        }
                    });
                }
            });
        }
    });
};

export const verifyResetCode = (req, res) => {
    const { email, resetCode } = req.body;

    db.query("SELECT * FROM users WHERE email = ? AND reset_code = ?", [email, resetCode], (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred." });
        } else if (result.length === 0) {
            res.status(400).send({ error: "Invalid reset code." });
        } else {
            res.status(200).send({ message: "Reset code verified successfully!" });
        }
    });
};

export const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query("UPDATE users SET password = ?, reset_code = NULL WHERE email = ? AND reset_code = ?", [hashedPassword, email, resetCode], (err, result) => {
            if (err) {
                res.status(400).send({ error: "An error occurred." });
            } else if (result.affectedRows === 0) {
                res.status(400).send({ error: "Invalid reset code." });
            } else {
                res.status(200).send({ message: "Password reset successfully!" });
            }
        });
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
};
