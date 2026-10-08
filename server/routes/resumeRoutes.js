import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import {
  createResume,
  deleteResume,
  getPublicResume,
  getResumeById,
  getUserResumes,
  updateResume
} from '../controllers/resumeController.js';

import upload from '../configs/multer.js';

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.delete('/:resumeId', protect, deleteResume);
resumeRouter.get('/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResume);
resumeRouter.get('/', protect, getUserResumes);

export default resumeRouter;