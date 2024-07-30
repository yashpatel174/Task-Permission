import express from "express";
import userSchema from "../model/userSchema.js";

const router = express.Router();

// Cleanup function to remove documents with null username
const cleanUpNullUsernames = async () => {
  const result = await userSchema.deleteMany({ userName: null });
  return result;
};

// Route to trigger the cleanup
router.delete("/delete", async (req, res) => {
  try {
    const result = await cleanUpNullUsernames();
    res.status(200).send({
      success: true,
      message: "Cleanup operation completed successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error during cleanup operation.",
      error: error.message,
    });
  }
});

export default router;
