import express from 'express';
import cors from 'cors';
import { registerUser, loginUser } from './src/Middleware/userMiddleware.js';  
import db from './src/database/db.js';  
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

const jwtSecret = "secret";  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.post('/register', registerUser);
app.post('/login', loginUser);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Ticket routes
app.post('/ticket', authenticateToken, (req, res) => {
    const { name, price, description, image } = req.body;

    db.query(
        "INSERT INTO ticket (name, price, description, image) VALUES (?, ?, ?, ?)",
        [name, price, description, image],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding the ticket." });
            } else {
                res.status(201).send({ message: "Ticket added successfully!" });
            }
        }
    );
});

app.get('/ticket', authenticateToken, (req, res) => {
    db.query("SELECT * FROM ticket", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching tickets." });
        } else {
            res.status(200).send(result);
        }
    });
});

// Event routes
app.post('/event', authenticateToken, (req, res) => {
    const { name, description, startDate, endDate, price, picture } = req.body;

    db.query(
        "INSERT INTO event (name, description, startDate, endDate, price, picture) VALUES (?, ?, ?, ?, ?, ?)",
        [name, description, startDate, endDate, price, picture],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while adding the event." });
            } else {
                res.status(201).send({ message: "Event added successfully!" });
            }
        }
    );
});

app.get('/event', authenticateToken, (req, res) => {
    db.query("SELECT * FROM event", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching events." });
        } else {
            res.status(200).send(result);
        }
    });
});

app.put('/event/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description, startDate, endDate, price, picture } = req.body;

    db.query(
        "UPDATE event SET name = ?, description = ?, startDate = ?, endDate = ?, price = ?, picture = ? WHERE id = ?",
        [name, description, startDate, endDate, price, picture, id],
        (err) => {
            if (err) {
                res.status(400).send({ error: "An error occurred while updating the event." });
            } else {
                res.status(200).send({ message: "Event updated successfully!" });
            }
        }
    );
});

app.delete('/event/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM event WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the event." });
        } else {
            res.status(200).send({ message: "Event deleted successfully!" });
        }
    });
});

// CMS routes
app.post('/cms', authenticateToken, (req, res) => {
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

app.get('/cms', authenticateToken, (req, res) => {
    db.query("SELECT * FROM cms", (err, result) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while fetching CMS entries." });
        } else {
            res.status(200).send(result);
        }
    });
});

app.put('/cms/:id', authenticateToken, (req, res) => {
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

app.delete('/cms/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM cms WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(400).send({ error: "An error occurred while deleting the CMS entry." });
        } else {
            res.status(200).send({ message: "CMS entry deleted successfully!" });
        }
    });
});

app.get('/currentUser', authenticateToken, (req, res) => {
    res.status(200).send(req.user);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default db;
