import express from "express";
const router = express.Router();

import {
  authMiddleware,
  checkPermission,
} from "../middleware/authMiddleware.js";
import {
  grantPermission,
  revokePermission,
} from "../controller/userController.js";

router.post(
  "/grant",
  authMiddleware,
  checkPermission("grant"),
  grantPermission
);
router.post(
  "/revoke",
  authMiddleware,
  checkPermission("grant"),
  revokePermission
);

export default router;
