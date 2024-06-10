import express from 'express';
import cors from 'cors';
import db from './src/database/db.js';
import authRoutes from './src/Routes/authRoutes.js';
import eventRoutes from './src/Routes/eventRoutes.js';
import cmsRoutes from './src/Routes/cmsRoutes.js';

const app = express();
const port = 3000;

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // replace with your front-end URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional setup for handling form data
app.use(express.static('public')); // Serve files from the 'public' directory
app.use('/events', express.static('public')); // Serve files from the 'public' directory for event images

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/cms', cmsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default db;
