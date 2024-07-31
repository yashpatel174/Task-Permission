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
  checkPermission(["Create"], (req) => req.body.moduleId),
  createModule
);
router.get(
  "/",
  authMiddleware,
  checkPermission(["GetAll"], (req) => req.body.moduleId),
  getAllModules
);
router.get(
  "/:moduleName",
  authMiddleware,
  checkPermission(["Get"], (req) => req.body.moduleId),
  getSingleModule
);
router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission(["Update"], (req) => req.body.moduleId),
  updateModule
);
router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission(["Delete"], (req) => req.body.moduleId),
  deleteModule
);

export default router;
