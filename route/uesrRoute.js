import express from "express";
import { login, register } from "../controller/authController.js";
import { permissionToUser } from "../controller/groupController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/permission", permissionToUser);

export default router;
