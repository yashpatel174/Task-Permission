import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    unique: true,
  },
  moduleNumber: {
    type: Number,
    unique: true,
  },
});

export default mongoose.model("Module", moduleSchema);
