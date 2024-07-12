import express from 'express'
import { createModule, getAllModules, getSingleModule, updateModule, deleteModule } from '../controller/moduleController.js';
import { checkPermission, verifyToken } from '../middleware/auth.js';

const router = express.Router()

router.route("/create").post(verifyToken, checkPermission('create'), createModule);
router.route("/").get(verifyToken, checkPermission('read'), getAllModules);
router.route("/:moduleName").get(verifyToken, checkPermission('read'), getSingleModule);
router.route("/update/:moduleName").patch(verifyToken, checkPermission('update'), updateModule);
router.route("/delete").delete(verifyToken, checkPermission('delete'), deleteModule);

// router.route("/create").post(createModule);
// router.route("/").get(getAllModules);
// router.route("/:moduleName").get(getSingleModule);
// router.route("/update/:moduleName").patch(updateModule);
// router.route("/delete").delete(deleteModule);
    
export default router;


