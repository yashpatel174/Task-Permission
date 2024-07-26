import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
  role: {
    type: String,
    default: "user",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  permissions: [{ type: String }],
});

groupSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model("Group", groupSchema);
