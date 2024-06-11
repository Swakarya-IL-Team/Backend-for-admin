import db from '../database/db.js';

export const addCmsEntry = (req, res) => {
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
};

export const getCmsEntries = (req, res) => {
    db.query("SELECT * FROM cms", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching CMS entries." });
        } else {
            res.status(200).send(result);
        }
    });
};

export const updateCmsEntry = (req, res) => {
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
};

export const deleteCmsEntry = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM cms WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the CMS entry." });
        } else {
            res.status(200).send({ message: "CMS entry deleted successfully!" });
        }
    });
};
