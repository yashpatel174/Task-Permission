import express from 'express';
import { addUsers, createGroup, deleteGroup, grantPermission, removeUsers, revokePermission } from '../controller/userController.js';

const router = express.Router();

router.post('/create', createGroup);
router.delete('/delete', deleteGroup);
router.post('/add-users', addUsers);
router.post('/remove-users', removeUsers);

export default router;