import express from "express";
import { login, register } from "../controller/authController.js";
import {
  uPermission,
  removeUserPermission,
} from "../controller/groupController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/permission", uPermission);
router.post("/permission/remove", removeUserPermission);

export default router;
