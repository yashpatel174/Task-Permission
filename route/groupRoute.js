import express from "express";
import {
  addUsers,
  createGroup,
  removeUsers,
  gPermission,
  removeGroupPermission,
} from "../controller/groupController.js";

const router = express.Router();

router.post("/create", createGroup);
router.post("/add-users", addUsers);
router.post("/remove-users", removeUsers);
router.post("/:groupId", gPermission);
router.post("/:groupId/remove", removeGroupPermission);

export default router;
