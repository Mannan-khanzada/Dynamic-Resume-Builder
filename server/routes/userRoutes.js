
import express from 'express';
import {getUserById, getUserResumeData, loginUser, registerUser} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';



const UserRouter = express.Router();

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.get('/data', protect, getUserById);
UserRouter.get('/resumes', protect, getUserResumeData);

export default UserRouter;
