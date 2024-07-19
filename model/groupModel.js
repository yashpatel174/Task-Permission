import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Group name is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Group password is required"],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  permissions: [{ type: String }],
});

export default mongoose.model("Group", groupSchema);
