import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    const { title, description, date, time, image } = req.body;

    db.query(
        "INSERT INTO event (title, description, date, time, image) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, time, image],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding the event." });
            } else {
                res.status(201).send({ message: "Event added successfully!" });
            }
        }
    );
});

router.get('/', authenticateToken, (req, res) => {
    db.query("SELECT * FROM event", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching events." });
        } else {
            res.status(200).send(result);
        }
    });
});

router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, image } = req.body;

    db.query(
        "UPDATE event SET title = ?, description = ?, date = ?, time = ?, image = ? WHERE id = ?",
        [title, description, date, time, image, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while updating the event." });
            } else {
                res.status(200).send({ message: "Event updated successfully!" });
            }
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM event WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the event." });
        } else {
            res.status(200).send({ message: "Event deleted successfully!" });
        }
    });
});

export default router;
