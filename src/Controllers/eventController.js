import db from '../database/db.js';

// Middleware to handle image uploads
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const addEvent = [upload.single('event_picture'), (req, res) => {
    const { event_name, event_description, event_date_start, event_date_end, event_price } = req.body;
    const event_picture = req.file ? req.file.buffer : null;

    db.query(
        "INSERT INTO event (event_name, event_picture, event_description, event_date_start, event_date_end, event_price) VALUES (?, ?, ?, ?, ?, ?)",
        [event_name, event_picture, event_description, event_date_start, event_date_end, event_price],
        (err, result) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding the event." });
            } else {
                db.query("SELECT * FROM event WHERE id = ?", [result.insertId], (err, event) => {
                    if (err) {
                        res.status(400).send({ error: "An error occurred while retrieving the new event." });
                    } else {
                        res.status(201).send(event);
                    }
                });
            }
        }
    );
}];

export const getEvents = (req, res) => {
    db.query("SELECT * FROM event", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching events." });
        } else {
            res.status(200).send(result);
        }
    });
};

export const getEventById = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM event WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching the event details." });
        } else {
            res.status(200).send(result[0]);
        }
    });
};

export const updateEvent = [upload.single('event_picture'), (req, res) => {
    const { id } = req.params;
    const { event_name, event_description, event_date_start, event_date_end, event_price } = req.body;
    const event_picture = req.file ? req.file.buffer : null;

    db.query(
        "UPDATE event SET event_name = ?, event_picture = ?, event_description = ?, event_date_start = ?, event_date_end = ?, event_price = ? WHERE id = ?",
        [event_name, event_picture, event_description, event_date_start, event_date_end, event_price, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while updating the event." });
            } else {
                db.query("SELECT * FROM event WHERE id = ?", [id], (err, event) => {
                    if (err) {
                        res.status(400).send({ error: "An error occurred while retrieving the updated event." });
                    } else {
                        res.status(200).send(event);
                    }
                });
            }
        }
    );
}];

export const deleteEvent = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM event WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the event." });
        } else {
            res.status(200).send({ message: "Event deleted successfully!" });
        }
    });
};
