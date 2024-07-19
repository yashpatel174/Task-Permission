import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    unique: true,
  },
  moduleId: {
    type: Number,
    unique: true,
  },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
});

export default mongoose.model("Module", moduleSchema);
