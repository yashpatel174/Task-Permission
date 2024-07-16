import express from 'express';
import {createModule, getAllModules, getSingleModule, updateModule, deleteModule} from '../controller/moduleController.js'
import {authMiddleware, checkPermission} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', authMiddleware, checkPermission('ACCESS'), createModule);
router.get('/', authMiddleware, checkPermission('ACCESS'), getAllModules);
router.get('/', authMiddleware, checkPermission('ACCESS'), getSingleModule);
router.patch('/update', authMiddleware, checkPermission('ACCESS'), updateModule);
router.delete('/create', authMiddleware, checkPermission('ACCESS'), deleteModule);

export default router;