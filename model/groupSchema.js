import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Group name is required."],
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groupPermission",
      default: [],
    },
  ],
});

export default mongoose.model("Group", groupSchema);
