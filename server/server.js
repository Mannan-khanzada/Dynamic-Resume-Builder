import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import UserRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('server is running...'));
app.use('/api/users', UserRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));