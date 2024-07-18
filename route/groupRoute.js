import express from "express";
import {
  addUsers,
  createGroup,
  deleteGroup,
  grantPermission,
  removeUsers,
  loginGroup,
  revokePermission,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", createGroup);
router.post("/login", loginGroup);
router.delete("/delete", deleteGroup);
router.post("/add-users", addUsers);
router.post("/remove-users", removeUsers);

export default router;
