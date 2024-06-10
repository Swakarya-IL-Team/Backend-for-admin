import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../Middleware/userMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
    const { title, description, date, time, location, image } = req.body;

    db.query(
        "INSERT INTO cms (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, date, time, location, image],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding the CMS entry." });
            } else {
                res.status(201).send({ message: "CMS entry added successfully!" });
            }
        }
    );
});

router.get('/', authenticateToken, (req, res) => {
    db.query("SELECT * FROM cms", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching CMS entries." });
        } else {
            res.status(200).send(result);
        }
    });
});

router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location, image } = req.body;

    db.query(
        "UPDATE cms SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ? WHERE id = ?",
        [title, description, date, time, location, image, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while updating the CMS entry." });
            } else {
                res.status(200).send({ message: "CMS entry updated successfully!" });
            }
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM cms WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the CMS entry." });
        } else {
            res.status(200).send({ message: "CMS entry deleted successfully!" });
        }
    });
});

export default router;
