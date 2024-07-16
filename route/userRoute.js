import express from 'express';
import { addUsers, createGroup, deleteGroup, removeUsers } from '../controller/userController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-group', authMiddleware, createGroup);
router.post('/delete-group', authMiddleware, deleteGroup);
router.post('/add-users', authMiddleware, addUsers);
router.post('/delete-users', authMiddleware, removeUsers);

export default router;