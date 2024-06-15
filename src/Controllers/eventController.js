import db from '../database/db.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { upload } from '../Middleware/Multer.js';


export const addEvent =  (req, res) => {
    const { event_name, event_description, event_date_start, event_date_end, event_price } = req.body;
    const event_picture = req.file ? req.file.filename : null;
    console.log(event_name);
    db.query(
        "INSERT INTO event (event_name, event_picture, event_description, event_date_start, event_date_end, event_price) VALUES (?, ?, ?, ?, ?, ?)",
        [event_name, event_picture, event_description, event_date_start, event_date_end, event_price],
        (err, result) => {
            if (err) {
                res.status(400).send({ error: "Terjadi kesalahan saat menambahkan acara.", err});
            } else {
                db.query("SELECT * FROM event WHERE id = ?", [result.insertId], (err, event) => {
                    if (err) {
                        res.status(400).send({ error: "Terjadi kesalahan saat mengambil acara baru." });
                    } else {
                        res.status(201).send(event);
                    }
                });
            }
        }
    );
};

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
    const event_picture = req.file ? req.file.filename : null;

    db.query(
        "UPDATE event SET event_name = ?, event_picture = ?, event_description = ?, event_date_start = ?, event_date_end = ?, event_price = ? WHERE id = ?",
        [event_name, event_picture, event_description, event_date_start, event_date_end, event_price, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "Terjadi kesalahan saat memperbarui acara." });
            } else {
                db.query("SELECT * FROM event WHERE id = ?", [id], (err, event) => {
                    if (err) {
                        res.status(400).send({ error: "Terjadi kesalahan saat mengambil acara yang diperbarui." });
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
