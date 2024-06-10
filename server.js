import express from 'express';
import cors from 'cors';
import db from './src/database/db.js';
import authRoutes from './src/Routes/authRoutes.js';
import eventRoutes from './src/Routes/eventRoutes.js';
import cmsRoutes from './src/Routes/cmsRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/cms', cmsRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default db;
