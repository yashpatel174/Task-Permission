import mongoose from "mongoose";

const groupPermission = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: [],
  },
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      default: [],
    },
  ],
});

export default mongoose.model("groupPermission", groupPermission);
