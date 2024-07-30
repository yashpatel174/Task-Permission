import userSchema from "../model/userSchema.js";
import groupSchema from "../model/groupSchema.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//* ============================================= user register =============================================

const register = async (req, res) => {
  const { userName, password, role, groupName } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await userSchema.findOne({ userName });
    if (existingUser) {
      return res.status(400).send({ message: "Username already exists." });
    }

    // Create a new user
    const user = new userSchema({
      userName,
      password,
      role,
    });
    console.log(user, "user initial");

    //* If group names are provided, find the groups and add to user's groups array
    if (groupName && Array.isArray(groupName) && groupName.length > 0) {
      const groups = await groupSchema.find({ name: { $in: groupName } });
      user.group = groups.map((group) => group._id.toString());

      // Add user to the groups' members array
      await Promise.all(
        groups.map(async (group) => {
          if (!group.members?.includes(user._id.toString())) {
            group.members.push(user._id.toString());
            await group.save();
          }
        })
      );
    }

    await user.save();
    console.log(user, "uuuuuuuuuuuuu");
    console.log(user.group, "gggggggggggg");

    res.status(201).send({
      success: true,
      message: "User registered successfully.",
      user: {
        username: user.userName,
        role: user.role,
        groups: user?.group,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).send({
      success: false,
      message: "Error during user registration.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(400).send({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const user = await userSchema.findOne({ userName });

    if (!user) {
      return res.status(400).send({ message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid username or password." });
    }

    const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(200).send({
      success: true,
      message: `${user.userName} logged in successfully.`,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};

export { register, login };
