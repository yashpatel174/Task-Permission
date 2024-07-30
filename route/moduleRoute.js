import express from "express";
import {
  createModule,
  getAllModules,
  getSingleModule,
  updateModule,
  deleteModule,
} from "../controller/moduleController.js";
import {
  authMiddleware,
  checkPermission,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  checkPermission(["Create"]),
  createModule
);
router.get("/", authMiddleware, checkPermission(["GetAll"]), getAllModules);
router.get(
  "/:moduleName",
  authMiddleware,
  checkPermission(["Get"]),
  getSingleModule
);
router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission(["Update"]),
  updateModule
);
router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission(["Delete"]),
  deleteModule
);

export default router;
