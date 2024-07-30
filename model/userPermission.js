import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userPermission = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  },
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groupPermission",
      default: [],
    },
  ],
});

export default mongoose.model("UserPermission", userPermission);
