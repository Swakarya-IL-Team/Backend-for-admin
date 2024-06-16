import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import db from './src/database/db.js';
import authRoutes from './src/Routes/authRoutes.js';
import eventRoutes from './src/Routes/eventRoutes.js';
import { upload } from './src/Middleware/Multer.js';
import { fileURLToPath } from 'url';
import museuminfoRoutes from './src/Routes/museuminfoRoutes.js';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   }
// });

// const upload = multer({ storage: storage });

// Static files setup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/museuminfo', museuminfoRoutes);

// Example route for handling file uploads
// app.post('/upload', upload.single('file'), (req, res) => {
//   try {
//     res.status(200).json({
//       message: 'File uploaded successfully',
//       file: req.file
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default db;
