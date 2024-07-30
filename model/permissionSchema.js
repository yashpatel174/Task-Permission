import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  permissions: {
    type: [String],
    enum: ["Create", "GetAll", "Get", "Update", "Delete"],
    default: [],
  },
  moduleId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      default: [],
    },
  ],
});

export default mongoose.model("Permission", permissionSchema);
