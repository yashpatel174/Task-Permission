import express from "express";
import {
  createGroup,
  getAllGroups,
  removeGroup,
  addUsers,
  removeUsers,
  gPermission,
  removeGroupPermission,
} from "../controller/groupController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createGroup);
router.get("/", authMiddleware, isAdmin, getAllGroups);
router.delete("/remove/:groupName", authMiddleware, isAdmin, removeGroup);
router.post("/add-users", authMiddleware, isAdmin, addUsers);
router.post("/remove-users", authMiddleware, isAdmin, removeUsers);
router.post("/:groupId", authMiddleware, isAdmin, gPermission);
router.post("/:groupId/remove", authMiddleware, isAdmin, removeGroupPermission);

export default router;
