import db from '../database/db.js';
import { upload } from '../Middleware/Multer.js';



export const addMuseumInfo = [upload.single('museum_picture'), (req, res) => {
    const { museum_name, museum_description, museum_address, museum_opening_hours, museum_ticket_price } = req.body;
    const museum_picture = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO museum_info (museum_name, museum_picture, museum_description, museum_address, museum_opening_hours, museum_ticket_price) VALUES (?, ?, ?, ?, ?, ?)",
        [museum_name, museum_picture, museum_description, museum_address, museum_opening_hours, museum_ticket_price],
        (err, result) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding museum info." });
            } else {
                db.query("SELECT * FROM museum_info WHERE id = ?", [result.insertId], (err, museumInfo) => {
                    if (err) {
                        res.status(400).send({ error: "An error occurred while fetching the new museum info." });
                    } else {
                        res.status(201).send(museumInfo[0]);
                    }
                });
            }
        }
    );
}];

export const getMuseumInfo = (req, res) => {
    db.query("SELECT * FROM museum_info", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching museum info." });
        } else {
            res.status(200).send(result);
        }
    });
};

export const getMuseumInfoById = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM museum_info WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching the museum info details." });
        } else {
            res.status(200).send(result[0]);
        }
    });
};

export const updateMuseumInfo = [upload.single('museum_picture'), (req, res) => {
    const { id } = req.params;
    const { museum_name, museum_description, museum_address, museum_opening_hours, museum_ticket_price } = req.body;
    const museum_picture = req.file ? req.file.filename : null;

    db.query(
        "UPDATE museum_info SET museum_name = ?, museum_picture = ?, museum_description = ?, museum_address = ?, museum_opening_hours = ?, museum_ticket_price = ? WHERE id = ?",
        [museum_name, museum_picture, museum_description, museum_address, museum_opening_hours, museum_ticket_price, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while updating museum info." });
            } else {
                db.query("SELECT * FROM museum_info WHERE id = ?", [id], (err, museumInfo) => {
                    if (err) {
                        res.status(400).send({ error: "An error occurred while fetching the updated museum info." });
                    } else {
                        res.status(200).send(museumInfo[0]);
                    }
                });
            }
        }
    );
}];

export const deleteMuseumInfo = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM museum_info WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting museum info." });
        } else {
            res.status(200).send({ message: "Museum info deleted successfully!" });
        }
    });
};

