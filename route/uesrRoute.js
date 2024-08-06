import express from "express";
import { login, register } from "../controller/authController.js";
import {
  uPermission,
  removeUserPermission,
} from "../controller/groupController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/permission", authMiddleware, isAdmin, uPermission);
router.post(
  "/permission/remove",
  authMiddleware,
  isAdmin,
  removeUserPermission
);

export default router;
