import express from 'express'
// import checkAdminPermission from "../middleware/adminPermission.js";
import {createModule, getAllModules, getSingleModule, updateModule, deleteModule} from "../controller/moduleController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import permissionMiddleware from "../middleware/permissionMiddleware.js"

const router = express.Router()

// router.route("/create").post(checkAdminPermission('create'), createModule);
// router.route("/").get(checkAdminPermission('getAll'), getAllModules);
// router.route("/:moduleName").get(checkAdminPermission('getOne'), getSingleModule);
// router.route("/update/:moduleName").patch(checkAdminPermission('update'), updateModule);
// router.route("/delete").delete(checkAdminPermission('delete'), deleteModule);



router.post('/create', authMiddleware, permissionMiddleware('crud'), createModule);
router.get('/', authMiddleware, permissionMiddleware('crud'), getAllModules);
router.get('/:moduleName', authMiddleware, permissionMiddleware('crud'), getSingleModule);
router.patch('/update/:moduleName', authMiddleware, permissionMiddleware('crud'), updateModule);
router.delete('/delete', authMiddleware, permissionMiddleware('crud'), deleteModule);


export default router;