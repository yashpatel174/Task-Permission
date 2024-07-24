import userSchema from "../model/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//* ============================================= user register =============================================

// const register = async (req, res) => {
//   const { userName, password, role } = req.body;

//   if (!userName || !password)
//     return res
//       .status(400)
//       .send({ message: "Username and Password are required." });

//   try {
//     const existingUser = await userSchema.findOne({ userName });
//     if (existingUser) {
//       return res.status(409).send({
//         message: `User already exists with the same name: ${existingUser.userName}.`,
//       });
//     }

//     const user = new userSchema({ userName, password, role });
//     await user.save();

//     console.log(user.role, "roleeeeeeeeeeleeeeeeeeeee");

//     if (!user) {
//       return res.status(403).send({ message: "User not created." });
//     }

//     res.status(201).send({
//       success: true,
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({
//       success: false,
//       message: "Error while registering user.",
//       error: error.message,
//     });
//   }
// };

//* ============================================= user login =============================================

const register = async (req, res) => {
  const { userName, password, role } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required." });
  }

  // // Ensure the role is valid
  // if (!["user", "admin"].includes(role)) {
  //   return res.status(400).send({ message: "Invalid role provided." });
  // }

  try {
    const user = new userSchema({
      userName,
      password,
      role,
    });

    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating user", error: error.message });
  }
};

// const login = async (req, res) => {
//   const { userName, password } = req.body;

//   try {
//     const user = await userSchema.findOne({ userName });

//     if (!user) {
//       res.status(400).send({
//         success: false,
//         message: "User not registered.",
//       });
//     }

//     if (!user.password) {
//       res.status(400).send({
//         success: false,
//         message: "User password is not available.",
//       });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);

//     if (!validPassword)
//       res.status(403).send({
//         success: false,
//         message: "Invalid userName or password.",
//       });

//     console.log("Role While login:", user.role);

//     //* ================ Create token ================
//     const token = JWT.sign(
//       { name: user.userName, role: user.role },
//       process.env.SECRET_KEY,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );

//     res.status(200).send({
//       success: true,
//       message: `${user.userName} logged in successfully`,
//       token,
//     });
//   } catch (error) {
//     console.log("Error =>", error.message);
//     res.status(500).send({
//       success: false,
//       message: "Error while logging in.",
//       error: error.message,
//     });
//   }
// };

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await userSchema.findOne({ userName });

    if (!user) {
      return res.status(400).send({ message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password, "Login");
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

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
