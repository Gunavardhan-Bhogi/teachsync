import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import classRoutes from './routes/class.routes.js';
import lectureRoutes from './routes/lecture.routes.js';

// dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TeachSync Backend API is running' });
});

// Route Mounts
app.use('/api/classes', classRoutes);
app.use('/api/lectures', lectureRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`TeachSync server running on port ${PORT}`);
});
