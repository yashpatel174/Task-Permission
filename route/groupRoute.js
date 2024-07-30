import express from "express";
import {
  addUsers,
  createGroup,
  removeUsers,
  permissionToGroup,
} from "../controller/groupController.js";

const router = express.Router();

router.post("/create", createGroup);
router.post("/add-users", addUsers);
router.post("/remove-users", removeUsers);
router.post("/permissions", permissionToGroup);

export default router;
