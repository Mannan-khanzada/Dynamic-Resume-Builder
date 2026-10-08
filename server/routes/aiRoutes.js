
import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { enhanceJobDescription, enhanceSummary, uploadResume } from '../controllers/aiController.js';


const aiRoutes = express.Router();

aiRoutes.post('/enhance-pro-sum', protect, enhanceSummary)

aiRoutes.post('/enhance-job-desc', protect, enhanceJobDescription)

aiRoutes.post('/upload-resume', protect, uploadResume)


export default aiRoutes
