import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import nodemailer from 'nodemailer';
import { upload } from '../Middleware/Multer.js';

const jwtSecret = "secret";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yout email',
        pass: 'your password aplication'
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email transporter:', error);
    } else {
        console.log('Email transporter is ready to send messages.');
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
                    const token = jwt.sign({ email: user.email, username: user.username }, jwtSecret, { expiresIn: '1h' });

                    res.status(200).send({ token });
                } else {
                    res.status(400).send({ error: "Invalid email or password." });
                }
            }
        }
    );
};

export const updateProfile = async (req, res) => {
    const { email, username, museum, phone, password } = req.body;
    const { email: userEmail } = req.user;
    const picture_profile = req.file ? req.file.path : null;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        let query = "UPDATE users SET email = ?, username = ?, museum = ?, phone = ?";
        let params = [email, username, museum, phone];

        if (hashedPassword) {
            query += ", password = ?";
            params.push(hashedPassword);
        }

        if (picture_profile) {
            query += ", picture_profile = ?";
            params.push(picture_profile);
        }

        query += " WHERE email = ?";
        params.push(userEmail);

        db.query(query, params, (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred during the update." });
            } else {
                res.status(200).send({ message: "Profile updated successfully!" });
            }
        });
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
};

export const sendResetCode = async (req, res) => {
    const { email } = req.body;

    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(400).send({ error: "An error occurred." });
            } else if (result.length === 0) {
                return res.status(400).send({ error: "No user found with this email." });
            } else {
                const resetCode = Math.floor(1000 + Math.random() * 9000).toString();  // generate 4-digit code

                db.query("UPDATE users SET reset_code = ? WHERE email = ?", [resetCode, email], async (err) => {
                    if (err) {
                        console.error('Database update error:', err);
                        return res.status(400).send({ error: "An error occurred." });
                    } else {
                        const mailOptions = {
                            from: 'your email',
                            to: email,
                            subject: 'Password Reset Code',
                            text: `Your password reset code is: ${resetCode}`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error sending email:', error);
                                return res.status(500).send({ error: "Failed to send email." });
                            } else {
                                console.log('Email sent:', info.response);
                                return res.status(200).send({ message: "Reset code sent successfully!" });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).send({ error: "Internal server error." });
    }
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
