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

router.post("/create", authMiddleware, checkPermission("grant"), createModule);
router.get("/", authMiddleware, checkPermission("grant"), getAllModules);
router.get(
  "/:moduleName",
  authMiddleware,
  checkPermission("grant"),
  getSingleModule
);
router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission("grant"),
  updateModule
);
router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission("grant"),
  deleteModule
);

export default router;
