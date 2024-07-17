import express from 'express';
import {createModule, getAllModules, getSingleModule, updateModule, deleteModule} from '../controller/moduleController.js'
import {authMiddleware, checkPermission} from '../middleware/authMiddleware.js';
import { grantPermission, revokePermission } from '../controller/userController.js';
const router = express.Router();

router.post('/create', authMiddleware, checkPermission('CRUD'), createModule);
router.get('/', authMiddleware, checkPermission('CRUD'), getAllModules);
router.get('/', authMiddleware, checkPermission('CRUD'), getSingleModule);
router.patch('/update', authMiddleware, checkPermission('CRUD'), updateModule);
router.delete('/create', authMiddleware, checkPermission('CRUD'), deleteModule);

// Grant and revoke permissions endpoints
router.post('/permissions/grant', authMiddleware, checkPermission('granted'), grantPermission);
router.post('/permissions/revoke', authMiddleware, checkPermission('revoked'), revokePermission);

export default router;