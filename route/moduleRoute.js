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
router.get("/", authMiddleware, checkPermission(["FindAll"]), getAllModules),
  router.get(
    "/:moduleName",
    authMiddleware,
    checkPermission(["FindOne"], (req) => req.params.moduleName),
    getSingleModule
  );
router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission(["Update"], (req) => req.params.moduleName),
  updateModule
);
router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission(["Delete"], (req) => req.params.moduleName),
  deleteModule
);

export default router;
